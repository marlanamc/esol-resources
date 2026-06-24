import test from "node:test";
import assert from "node:assert/strict";
import { expandClassIdsToSectionGroupIds } from "@/lib/section-group-classes";

test("expandClassIdsToSectionGroupIds includes sibling sections from the same group", async () => {
  const records = [
    { id: "class-a", sectionGroupId: "group-1" },
    { id: "class-b", sectionGroupId: "group-1" },
    { id: "class-c", sectionGroupId: "group-2" },
  ];

  const prismaClient = {
    class: {
      async findMany({ where, select }: { where: Record<string, unknown>; select: { id: true; sectionGroupId?: true } }) {
        if ("id" in where) {
          const ids = ((where.id as { in: string[] }).in ?? []);
          return records
            .filter((record) => ids.includes(record.id))
            .map((record) => (select.sectionGroupId ? record : { id: record.id }));
        }

        if ("sectionGroupId" in where) {
          const groupIds = ((where.sectionGroupId as { in: string[] }).in ?? []);
          return records
            .filter((record) => record.sectionGroupId && groupIds.includes(record.sectionGroupId))
            .map((record) => ({ id: record.id }));
        }

        return [];
      },
    },
  };

  const result = await expandClassIdsToSectionGroupIds(prismaClient, ["class-a"]);

  assert.deepEqual(result.sort(), ["class-a", "class-b"]);
});

test("expandClassIdsToSectionGroupIds leaves standalone classes unchanged", async () => {
  const prismaClient = {
    class: {
      async findMany({ where, select }: { where: Record<string, unknown>; select: { id: true; sectionGroupId?: true } }) {
        if ("id" in where) {
          const ids = ((where.id as { in: string[] }).in ?? []);
          return ids.map((id) => (select.sectionGroupId ? { id, sectionGroupId: null } : { id }));
        }

        return [];
      },
    },
  };

  const result = await expandClassIdsToSectionGroupIds(prismaClient, ["solo-class"]);

  assert.deepEqual(result, ["solo-class"]);
});
