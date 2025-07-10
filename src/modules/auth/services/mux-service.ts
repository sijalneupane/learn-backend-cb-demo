import axios from 'axios';
// Add to your MuxService
import { Readable } from 'stream';

/**
 * Creates a direct upload and uploads a local video file to Mux in one step.
 * @param filePath Local path to the video file
 * @param title Optional title or passthrough metadata
 */

// mux.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import Mux, { BadRequestError } from '@mux/mux-node';

dotenv.config();

@Injectable()
export class MuxService {
  private muxClient:Mux;
  constructor() {
    this.muxClient = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });
    // const { Video } = require('@mux/mux-node/');
    // this.video = new Video(mux=this.muxClient);
  }

  /**
   * Creates a direct upload URL for the client to upload a video file directly to Mux.
   * @param title Optional title or passthrough metadata
   */
  async createDirectUpload(title?: string) {
    const upload = await this.muxClient.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        passthrough: title,
      },
      cors_origin: '*', // Adjust as needed for security
    });
    return upload;
  }

  /**
   * Get the status of a direct upload by upload ID
   */

  async getUpload(uploadId: string) {
    return this.muxClient.video.uploads.retrieve(uploadId);
  }

  /**
   * Get the status of an asset by asset ID
   */
  async getAsset(assetId: string) {
    return this.muxClient.video.assets.retrieve(assetId);
  }
  /**
   * Creates a direct upload and uploads a local video file to Mux in one step.
   * @param filePath Local path to the video file
   * @param title Optional title or passthrough metadata
   */
  async uploadLocalVideoToMux(filePath: string, title?: string) {
    try {
      const upload = await this.createDirectUpload(title);
      const uploadUrl = upload.url;
      if (!uploadUrl) {
        throw new Error('Failed to get upload URL from Mux');
      }
      const fileStream = fs.createReadStream(filePath);
      const stats = fs.statSync(filePath);
      const contentLength = stats.size;
      await axios.put(uploadUrl, fileStream, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': contentLength,
        },
        // maxBodyLength: Infinity,
        // maxContentLength: Infinity,
      });
      return upload;
    } catch (error) {
      throw new BadRequestException("Error:  "+error);
    }
  }




  
/**
 * Upload file buffer directly to Mux
 * @param file Multer file object from frontend
 * @param title Optional title for the video
 */
async uploadFileToMux(file: Express.Multer.File, title?: string) {
  try {
    // Step 1: Create direct upload URL
    const upload = await this.createDirectUpload(title || file.originalname);
    const uploadUrl = upload.url;

    if (!uploadUrl) {
      throw new Error('Failed to get upload URL from Mux');
    }

    // Step 2: Convert buffer to stream and upload
    const fileStream = Readable.from(file.buffer);
    
    await axios.put(uploadUrl, fileStream, {
      headers: {
        'Content-Type': file.mimetype || 'video/mp4',
        'Content-Length': file.size.toString(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    console.log(`File ${file.originalname} uploaded successfully to Mux`);
    
    return {
      uploadId: upload.id,
      assetId: upload.asset_id,
      status: 'uploaded',
      filename: file.originalname,
      size: file.size,
      message: 'File uploaded successfully to Mux'
    };
  } catch (error) {
    console.error('Error uploading file to Mux:', error);
    throw new BadRequestException(`Upload failed: ${error.message}`);
  }
}

/**
 * Get playback URL for a Mux asset
 * @param assetId Mux asset ID
 */
async getPlaybackUrl(assetId: string) {
  try {
    const asset = await this.getAsset(assetId);
    
    if (!asset.playback_ids || asset.playback_ids.length === 0) {
      throw new Error('No playback IDs found for this asset');
    }

    const playbackId = asset.playback_ids[0].id;
    const playbackUrl = `https://stream.mux.com/${playbackId}.m3u8`;
    
    return playbackUrl;
  } catch (error) {
    throw new BadRequestException(`Failed to get playback URL: ${error.message}`);
  }
}

/**
 * Get asset with playback info
 * @param assetId Mux asset ID
 */
async getAssetWithPlayback(assetId: string) {
  try {
    const asset = await this.getAsset(assetId);
    
    let playbackUrl :string|null= null;
    if (asset.playback_ids && asset.playback_ids.length > 0) {
      const playbackId = asset.playback_ids[0].id;
      playbackUrl = `https://stream.mux.com/${playbackId}.m3u8`;
    }

    return {
      ...asset,
      playbackUrl,
      isReady: asset.status === 'ready'
    };
  } catch (error) {
    throw new BadRequestException(`Failed to get asset: ${error.message}`);
  }
}

async uploadAndGetPlaybackId(file: Express.Multer.File, title?: string): Promise<string> {
    try {
      // Step 1: Create direct upload URL
      const upload = await this.createDirectUpload(title || file.originalname);
      const uploadUrl = upload.url;

      if (!uploadUrl) {
        throw new Error('Failed to get upload URL from Mux');
      }

      // Step 2: Upload the file buffer
      const fileStream = Readable.from(file.buffer);
      await axios.put(uploadUrl, fileStream, {
        headers: {
          'Content-Type': file.mimetype || 'video/mp4',
          'Content-Length': file.size.toString(),
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      // Step 3: Poll for asset ID (Mux creates an asset after upload completes)
      let assetId: string | null = null;
      const maxAttempts = 30; // Max 5 minutes (30 * 10s)
      let attempts = 0;
      const pollInterval = 10000; // 10 seconds

      while (!assetId && attempts < maxAttempts) {
        const uploadStatus = await this.getUpload(upload.id);
        if (uploadStatus.asset_id) {
          assetId = uploadStatus.asset_id;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        attempts++;
      }

      if (!assetId) {
        throw new Error('Failed to retrieve asset ID after upload');
      }

      // Step 4: Wait for asset to be ready and get playback ID
      attempts = 0;
      while (attempts < maxAttempts) {
        const asset = await this.getAsset(assetId);
        if (asset.status === 'ready' && asset.playback_ids && asset.playback_ids.length > 0) {
          return asset.playback_ids[0].id;
        }
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        attempts++;
      }

      throw new Error('Asset not ready or no playback ID available after maximum attempts');
    } catch (error) {
      console.error('Error in uploadAndGetPlaybackId:', error);
      throw new BadRequestException(`Failed to upload and get playback ID: ${error.message}`);
    }
  }
}
