class EnvironmentManager {

    localEnv = [100][100];

    constructor(){

    }

    getEnvByXYPos(x, y){
        const envArrX = Math.trunc(x/10);
        const envArrY = Math.trunc(y/10);

        return this.local_env[envArrX][envArrY];
    }

}

export const getEnvironmentManager = () => {
    return EnvironmentManager.instance || null;
};

export default EnvironmentManager;
