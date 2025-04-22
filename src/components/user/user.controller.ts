import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
    TApiUserResponse,
    TApiUsersResponse,
    UserCreateDto,
    UserUpdateDto,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { CreateUserOperation } from './decorator/createUserOperation.decorator';
import { GetUsersOperation } from './decorator/getUsersOperation.decorator';
import { GetOneUserOperation } from './decorator/getOneUserOperation.decorator';
import { UpdateUserOperation } from './decorator/updateUserOperation.decorator';
import { DeleteUserOperation } from './decorator/deleteUserOperation.decorator';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @CreateUserOperation()
    @Post()
    async createUser(
        @Body() dto: UserCreateDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        return await this.userService.createUser(dto);
    }

    @GetUsersOperation()
    @Get()
    async getUsers() // @Query() query: PageDto,
    : Promise<TApiResp<TApiUsersResponse>> {
        return await this.userService.getUsers();
    }

    @GetOneUserOperation()
    @Get(':userId')
    async getOneUser(
        @Param('userId', ParseUUIDPipe) userId: string,
    ): Promise<TApiResp<TApiUserResponse>> {
        return await this.userService.getOneUser(userId);
    }

    @UpdateUserOperation()
    @Patch(':userId')
    async updateUser(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body() dto: UserUpdateDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        return await this.userService.updateUser(userId, dto);
    }

    @DeleteUserOperation()
    @Delete(':userId')
    async deleteUser(
        @Param('userId', ParseUUIDPipe) userId: string,
    ): Promise<TApiResp<true>> {
        return await this.userService.deleteUser(userId);
    }
}
