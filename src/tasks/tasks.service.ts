import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto, user: { userId: number }) {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      user: { id: user.userId },
    });
    return this.taskRepository.save(newTask);
  }

  findAll(userId: number) {
    return this.taskRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!task)
      throw new NotFoundException(`Task dengan ID ${id} tidak ditemukan`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.findOne(id, userId); // Pastikan task itu milik si user
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId); // Pastikan task itu milik si user
    await this.taskRepository.remove(task);
    return { message: `Task ID ${id} berhasil dihapus` };
  }
}
