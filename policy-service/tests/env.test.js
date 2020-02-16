test(".env is applied", () => {
  expect(process.env.ENV_OK).toBe("1");
});
