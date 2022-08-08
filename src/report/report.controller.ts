import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {ReportService} from "./report.service";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {ReportResponseDto} from "./dto/report-response.dto";
import {CreateReportDto} from "./dto/create-report.dto";
import {JwtAuthGuard} from "../authorization/guards/jwt-auth.guard";

@Controller({ version: '1', path: 'reports' })
export class ReportController {
    constructor(private reportService: ReportService) {}

    // create report
    @Post("create")
    @ApiCreatedResponse({ type: ReportResponseDto, description: 'Report created' })
    @UseGuards(JwtAuthGuard)
    async createReport(@Body() createReportDto: CreateReportDto): Promise<ReportResponseDto> {
        return await this.reportService.createReport(createReportDto);
    }

    // get all reports
    @Get("all")
    @ApiCreatedResponse({ type: [ReportResponseDto], description: 'All Reports' })
    @UseGuards(JwtAuthGuard)
    async getAllReports(): Promise<ReportResponseDto[]> {
        return await this.reportService.getAllReports();
    }

    // get report by id
    @Get("report/:id")
    @ApiCreatedResponse({type: ReportResponseDto, description: "report"})
    @UseGuards(JwtAuthGuard)
    async getReport(@Param("id") id: string): Promise<ReportResponseDto> {
        return await this.reportService.getReport(id);
    }

    // get report by user id
    @Get("user-reports/:id")
    @ApiCreatedResponse({type: [ReportResponseDto], description: "user reports"})
    @UseGuards(JwtAuthGuard)
    async getUserReports(@Param("id") id: string): Promise<ReportResponseDto[]> {
        return await this.reportService.getUserReports(id);
    }

    // update report by id
    @Patch("update/:id")
    @ApiCreatedResponse({type: ReportResponseDto, description: "update report"})
    @UseGuards(JwtAuthGuard)
    async updateReport(@Param("id") id: string, @Body() updateReportDto: CreateReportDto): Promise<ReportResponseDto> {
        return await this.reportService.updateReport(id, updateReportDto);
    }

    // delete report by id
    @Delete("delete/:id")
    @ApiCreatedResponse({type: ReportResponseDto, description: "delete report"})
    @UseGuards(JwtAuthGuard)
    async deleteReport(@Param("id") id: string): Promise<boolean> {
        return await this.reportService.deleteReport(id);
    }
}
