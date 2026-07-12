import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  getAssets(@Req() req: any, @Query('status') status?: string) {
    return this.assetsService.getAssets(req.user.tenantId, status);
  }

  @Get(':id')
  getAssetById(@Req() req: any, @Param('id') id: string) {
    return this.assetsService.getAssetById(req.user.tenantId, id);
  }

  @Post()
  createAsset(@Req() req: any, @Body() data: any) {
    return this.assetsService.createAsset(req.user.tenantId, data);
  }

  @Patch(':id')
  updateAsset(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.assetsService.updateAsset(req.user.tenantId, id, data);
  }

  @Delete(':id')
  deleteAsset(@Req() req: any, @Param('id') id: string) {
    return this.assetsService.deleteAsset(req.user.tenantId, id);
  }
}
