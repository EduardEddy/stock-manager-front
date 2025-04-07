const apiServer = process.env.REACT_APP_API_SERVER;

if (!apiServer) {
  throw new Error('REACT_APP_API_SERVER is not defined in .env');
}

export const envs = {
  apiServer,
};

