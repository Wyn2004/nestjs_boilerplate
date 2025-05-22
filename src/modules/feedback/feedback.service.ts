import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    const createNewFeedback = new this.feedbackModel(createFeedbackDto);
    const response = await createNewFeedback.save();
    return response.toJSON();
  }

  async findAll() {
    const feedbacks = await this.feedbackModel.find().exec();
    return feedbacks.map((fb) => fb.toJSON());
  }

  async findOne(id: string) {
    const feedback = await this.feedbackModel.findById(id).exec();
    if (!feedback) throw new NotFoundException('Feedback not cfound');
    return feedback;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    console.log(updateFeedbackDto);
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
