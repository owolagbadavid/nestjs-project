export const configuration = () => ({
  app: {
    secret: process.env.JWT_SECRET,
  },
  database: {},
});
