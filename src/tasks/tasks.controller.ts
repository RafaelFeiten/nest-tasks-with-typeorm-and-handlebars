import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Render,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksEntity } from './tasks.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tarefas')
export class TasksController {
  constructor(
    @InjectRepository(TasksEntity) private model: Repository<TasksEntity>,
  ) {}

  //------ Views ------
  @Get('')
  @Render('index')
  async viewIndex() {
    const tasks = await this.model.find();
    return { tasks };
  }

  @Get('/criar')
  @Render('create')
  viewCreate() {}

  @Get(':id')
  @Render('showDetails')
  async viewShowDetails(@Param('id') id: string) {
    const task = await this.model.findOne({ where: { id } });
    return { task };
  }

  @Get(':id/editar')
  @Render('edit')
  async viewEdit(@Param('id') id: string) {
    const task = await this.model.findOne({ where: { id } });
    return { task };
  }

  //------ API ------
  @Post('/create')
  @Redirect('/tarefas')
  async create(@Body() body: TasksEntity) {
    const task = new TasksEntity();
    task.status = TaskStatus.OPEN;
    task.description = body.description;
    task.title = body.title;

    await this.model.save(task);
    return { task };
  }

  @Patch(':id')
  @Redirect('/tarefas')
  async update(@Body() body: TasksEntity, @Param('id') id: string) {
    const task = await this.model.findOne({ where: { id } });
    task.status = body.status;
    task.description = body.description;
    task.title = body.title;

    await this.model.update({ id }, task);
    return { task };
  }

  @Delete(':id')
  @Redirect('/tarefas')
  delete(@Param('id') id: string) {
    this.model.delete(id);
  }
}
