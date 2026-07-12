module.exports = {
  schema: "apps/api/prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
