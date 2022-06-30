import { prisma } from "../server";
import { nameToHandle } from "shared/utils/name";

export const findBabyboxOrCreate = async (
  babyboxName: string
): Promise<string> => {
  return new Promise(async (resolve, _) => {
    let babybox = await prisma.babybox.findFirst({
      where: {
        name: babyboxName,
      },
    });
    if (babybox === null) {
      babybox = await prisma.babybox.create({
        data: {
          name: babyboxName,
          handle: nameToHandle(babyboxName),
          metadata: {},
        },
      });
    }
    return resolve(babybox.id);
  });
};
