import { Controller, Post, Body, Get } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { StartJourneyDto } from './dto/start-journey.dto';
import { EndJourneyDto } from './dto/end-journey.dto';
import { MonthlySummaryDto } from './dto/monthly-summary.dto';

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  // Create a journey
  @Post('create')
  async createJourney(@Body() createJourneyDto: CreateJourneyDto) {
    return this.journeyService.createJourney(createJourneyDto);
  }

  // Start a journey
  @Post('start')
  async startJourney(@Body() startJourneyDto: StartJourneyDto) {
    return this.journeyService.startJourney(startJourneyDto);
  }

  // End a journey
  @Post('end')
  async endJourney(@Body() endJourneyDto: EndJourneyDto) {
    return this.journeyService.endJourney(endJourneyDto);
  }
  
  // Endpoint to get monthly summary
  @Get('monthly-summary')
  async getMonthlySummary(@Body() monthlySummaryDto: MonthlySummaryDto) {
    return this.journeyService.getMonthlySummary(monthlySummaryDto);
  }
}  
