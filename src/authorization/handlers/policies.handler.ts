import { Action } from '../../enums/actions.enum';
import { AppAbility } from '../../casl/casl-ability.factory';
import { IPolicyHandler } from '../../interface/interface';
import { User } from '../../user/schemas/user.schema';
import { Admin } from '../../admin/schemas/admin.schema';

export class ReadUserPolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility) {
        return ability.can(Action.Read, User);
    }
}

// read admin policy handler
export class ReadAdminPolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility) {
        return ability.can(Action.Read, Admin);
    }
}

// manage user policy handler
export class ManageUserPolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility) {
        return ability.can(Action.Manage, User);
    }
}
