import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Report, ReportModel} from "./schemas/report.schema";
import {Model} from "mongoose";
import {CoordinateService} from "../coordinate/coordinate.service";
import {ReportResponseDto} from "./dto/report-response.dto";
import {CreateReportDto} from "./dto/create-report.dto";
import {CreateCoordinateDto} from "../coordinate/dto/create-coordinate.dto";

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private reportModel: Model<ReportModel>,
        private coordinateService: CoordinateService,
    ) {}

    // Create a new report
    async createReport(createReportDto: CreateReportDto): Promise<ReportResponseDto | any> {
        try{
            const { lat, lng } = createReportDto.coordinates;
            const createCoordinateDto = new CreateCoordinateDto();
            createCoordinateDto.lat = lat;
            createCoordinateDto.lng = lng;
            const coordinate = await this.coordinateService.createCoordinate(createCoordinateDto);
            const createdReport = new this.reportModel({
                    ...createReportDto,
                    coordinates : coordinate._id,
                });
            return createdReport.save();
        }catch (error) {
            return error;
        }
    }

    // Get all reports
    async getAllReports(): Promise<ReportResponseDto[] | any> {
        try{
            const reports = await this.reportModel
                .find()
                .populate('coordinates')
                .populate("author")
                .sort({createdAt: -1})
                .exec();
            // go through all reports and remove password and salt from author
            reports.forEach((report) => {
                report.author[0].password = "";
                report.author[0].salt = "";
                report.author[0].passwordResetKey = "";
            });
            return reports;
        }catch (error) {
            return error;
        }
    }

    // get report by id
    async getReport(id: string): Promise<ReportResponseDto | any> {
        try{
            const report = await this.reportModel
                .findById(id)
                .populate('coordinates')
                .populate("author")
                .exec();
            // go through all reports and remove password and salt from author
            report.author[0].password = "";
            report.author[0].salt = "";
            report.author[0].passwordResetKey = "";
            return report;
        }catch (error) {
            return error;
        }
    }

    // update report
    async updateReport(id: string, updateReportDto: CreateReportDto): Promise<ReportResponseDto | any> {
        try{
            const report = await this.reportModel.findById(id);
            if(report){
                // if coordinates are changed, delete old coordinate and create new one
                if(updateReportDto.coordinates){
                    await this.coordinateService
                        .updateCoordinate(
                            report.coordinates.toString(),
                            updateReportDto.coordinates,
                        );
                }
                // if title is changed, update title
                if(updateReportDto.title){
                    report.title = updateReportDto.title;
                }
                // if description is changed, update description
                if(updateReportDto.description){
                    report.description = updateReportDto.description;
                }
                // if report type is changed, update report type
                if(updateReportDto.reportType){
                    report.reportType = updateReportDto.reportType;
                }
                // if location is changed, update location
                if(updateReportDto.location){
                    report.location = updateReportDto.location;
                }
                // save report
                return report.save();
            }
            return report;
        }catch (error) {
            return error;
        }
    }

    // get reports by user id
    async getUserReports(id: string): Promise<ReportResponseDto[] | any> {
        try{
            // get all reports
            const reports = await this.getAllReports();
            // go through all reports and find the ones that belong to the user
            return reports.filter((report) => {
                return report.author[0]._id.toString() === id;
            });
        }catch (error) {
            return error;
        }
    }

    // delete report by id
    async deleteReport(id: string): Promise<boolean> {
        try{
            const report = await this.reportModel.findById(id);
            if(report){
                // delete coordinate
                await this.coordinateService.getCoordinateById(report.coordinates.toString());
            }
            // delete report
            const _isDeleted = this.reportModel.findByIdAndDelete(id);
            return !!_isDeleted;
        }catch (error) {
            return error;
        }
    }
}
