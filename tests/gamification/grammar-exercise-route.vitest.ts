import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  find: vi.fn(), update: vi.fn(), create: vi.fn(), award: vi.fn(),
}));
vi.mock("next-auth", () => ({getServerSession: async () => ({user:{id:"student"}})}));
vi.mock("@/lib/auth/auth", () => ({authOptions:{}}));
vi.mock("@/lib/database/prisma", () => ({prisma:{activityProgress:{findFirst:mocks.find,update:mocks.update,create:mocks.create}}}));
vi.mock("@/lib/gamification/gamification", () => ({POINTS:{GRAMMAR_EXERCISE:5}}));
vi.mock("@/lib/gamification/award-chain", () => ({applyAwardChain:mocks.award}));
import { POST } from "@/app/api/grammar/exercise-progress/route";
const request = () => new Request("http://localhost/api/grammar/exercise-progress", {method:"POST",body:JSON.stringify({slug:"verb-forms-overview",exerciseId:"know-the-codes",sectionId:"five-codes"})});
beforeEach(() => {vi.clearAllMocks();mocks.find.mockResolvedValue(null);mocks.award.mockResolvedValue({deduped:false});});
describe("grammar exercise award persistence", () => {
  it("uses the atomic ledger award chain and saves the original reward key", async () => {
    const response = await POST(request());
    expect((await response.json()).pointsAwarded).toBe(5);
    expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({userId:"student",points:5,reason:"grammar-exercise:verb-forms-overview:five-codes:know-the-codes",dedupeKey:true}));
    const saved = JSON.parse(mocks.create.mock.calls[0][0].data.categoryData);
    expect(saved.exercises["five-codes:know-the-codes"].pointsAwarded).toBe(5);
    expect(saved.totalExercisePoints).toBe(5);
  });
  it("does not award an already credited exercise again", async () => {
    mocks.find.mockResolvedValue({id:"p",categoryData:JSON.stringify({exercises:{"five-codes:know-the-codes":{completed:true,pointsAwarded:5}},totalExercisePoints:5})});
    expect((await (await POST(request())).json()).pointsAwarded).toBe(0);
    expect(mocks.award).not.toHaveBeenCalled();
  });
  it("repairs progress after a ledger award without reporting a second award", async () => {
    mocks.award.mockResolvedValue({deduped:true});
    const response = await POST(request());
    expect((await response.json()).pointsAwarded).toBe(0);
    expect(JSON.parse(mocks.create.mock.calls[0][0].data.categoryData).totalExercisePoints).toBe(5);
  });
});
