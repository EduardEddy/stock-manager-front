const apiServer = process.env.API_SERVER;

if (!apiServer) {
  throw new Error('API_SERVER is not defined in .env');
}

export const envs = {
  apiServer,
};

