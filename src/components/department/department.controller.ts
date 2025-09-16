import { Controller, Get } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiTags } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { GetAllDepartmentsOperation } from './decorator/getAllDepartmentsOperation.decorator';

@ApiTags('Department')
@ADMIN()
@Controller('department')
export class DepartmentController {
    constructor(private departmentService: DepartmentService) {}

    @GetAllDepartmentsOperation()
    @Get()
    async getAllDepartments() {
        return await this.departmentService.getAllDepartments();
    }
}
