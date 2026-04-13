import { prisma } from "@/lib/prisma";

type PrismaModelField = {
    name: string;
};

type PrismaModel = {
    name: string;
    fields?: PrismaModelField[];
};

type PrismaDmmf = {
    datamodel?: {
        models?: PrismaModel[];
    };
};

type PrismaClientWithDmmf = {
    _dmmf?: PrismaDmmf;
};

let activityReleasedMetadataSupportCache: boolean | null = null;

export function supportsActivityIsReleasedInContent(): boolean {
    if (activityReleasedMetadataSupportCache !== null) {
        return activityReleasedMetadataSupportCache;
    }

    const dmmf = (prisma as unknown as PrismaClientWithDmmf)._dmmf;
    const activityModel = dmmf?.datamodel?.models?.find((model) => model.name === "Activity");
    activityReleasedMetadataSupportCache = Boolean(
        activityModel?.fields?.some((field) => field.name === "isReleasedInContent")
    );
    return activityReleasedMetadataSupportCache;
}
