import BaseRepository from "./base-repository"

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class DeploymentRepository extends BaseRepository
{
    constructor(enforcer)
    {
        super();

        if (enforcer !== singletonEnforcer)
        {
            throw "Cannot construct singleton!";
        }
    }

    static get instance()
    {
        if (!this[singleton])
        {
            this[singleton] = new DeploymentRepository(singletonEnforcer);
        }

        return this[singleton];
    }

    deployToQA(projectName, version)
    {
        const data =
        {
            projectName: projectName,
            version: version
        };

        return this.doPost("/deploy/qa", data);
    }

    deployToStaging(projectName, version)
    {
        const data =
        {
            projectName: projectName,
            version: version
        };

        return this.doPost("/deploy/staging", data);
    }
}

export const deploymentRepository = DeploymentRepository.instance;