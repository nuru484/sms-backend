// src / utils / middleware / isRevoked.js;

// Middleware to check if user is revoked
export default async (req, res, next) => {
  const userId = req.user.id;

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });

  if (user.isRevoked) {
    return res
      .status(403)
      .json({ error: 'Access revoked. Please contack school admin.' });
  }

  next();
};
