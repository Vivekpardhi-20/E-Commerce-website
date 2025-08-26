import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.productsService.findAllPaginated(
      Number(page),
      Number(pageSize),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '-' + file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(@UploadedFile() file: any, @Body() body: CreateProductDto) {
    const imageUrl = `/uploads/${file.filename}`;
    return this.productsService.create({ ...body, imageUrl });
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(+id, updateDto);
  }
}
