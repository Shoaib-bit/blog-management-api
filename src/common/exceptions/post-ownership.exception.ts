import { ForbiddenException } from '@nestjs/common'

export class PostOwnershipException extends ForbiddenException {
    constructor() {
        super('You are not authorized to perform this action on this post')
    }
}
