import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { MuxService } from '../services/mux-service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Mux')
@Controller('mux')
export class MuxController {
  constructor(private readonly muxService: MuxService) {}

  /**
   * Create a direct upload URL
   * POST /mux/upload
   * Body: { title?: string }
   */
  // @Post('upload')
  // @ApiOperation({ summary: 'Create a direct upload URL for Mux' })
  // @ApiBody({
  //   schema: {
  //     properties: { title: { type: 'string', example: 'My Video Title' } },
  //     required: [],
  //   },
  // })
  // @ApiResponse({ status: 201, description: 'Direct upload URL created' })
  // @ApiResponse({ status: 500, description: 'Mux upload error' })
  // async createDirectUpload(@Body('title') title?: string) {
  //   try {
  //     const upload = await this.muxService.createDirectUpload(title);
  //     return upload;
  //   } catch (error) {
  //     throw new HttpException(
  //       error?.message || 'Mux upload error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  /**
   * Get upload status
   * GET /mux/upload/:id
   */
  @Get('upload/:id')
  @ApiOperation({ summary: 'Get the status of a direct upload by upload ID' })
  @ApiParam({ name: 'id', description: 'Mux upload ID' })
  @ApiResponse({ status: 200, description: 'Upload status returned' })
  @ApiResponse({ status: 500, description: 'Mux upload status error' })
  async getUpload(@Param('id') id: string) {
    try {
      return await this.muxService.getUpload(id);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Mux upload status error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get asset status
   * GET /mux/asset/:id
   */
  @Get('asset/:id')
  @ApiOperation({ summary: 'Get the status of an asset by asset ID' })
  @ApiParam({ name: 'id', description: 'Mux asset ID' })
  @ApiResponse({ status: 200, description: 'Asset status returned' })
  @ApiResponse({ status: 500, description: 'Mux asset status error' })
  async getAsset(@Param('id') id: string) {
    try {
      return await this.muxService.getAsset(id);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Mux asset status error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video file from frontend to Mux' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
          example: 'My Video Title',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Video uploaded to Mux successfully',
  })
  @ApiResponse({ status: 500, description: 'Upload failed' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.muxService.uploadFileToMux(file, title);
      return result;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to upload file to Mux',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('playback/:assetId')
  @ApiOperation({ summary: 'Get playback URL for a Mux asset' })
  @ApiParam({ name: 'assetId', description: 'Mux asset ID' })
  @ApiResponse({ status: 200, description: 'Playback URL returned' })
  async getPlaybackUrl(@Param('assetId') assetId: string) {
    try {
      const playbackUrl = await this.muxService.getPlaybackUrl(assetId);
      return { playbackUrl };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get playback URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('upload-vide-get-playback')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video file from frontend to Mux and get playback id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
          example: 'My Video Title',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Video uploaded to Mux successfully',
  })
  @ApiResponse({ status: 500, description: 'Upload failed' })
  async uploadFileGetPlayback(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.muxService.uploadAndGetPlaybackId(file, title);
      return result;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to upload file to Mux',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
