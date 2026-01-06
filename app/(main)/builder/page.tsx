import { getWeaponsAction } from "@/app/actions/weapons";
import { BuilderForm } from "@/components/features/builder/BuilderForm";

export default async function BuilderPage() {
    const weapons = await getWeaponsAction();

    return (
        <div className="container max-w-2xl py-8 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-foreground">Create New Build</h1>
                <p className="text-muted-foreground mt-2">
                    Share your best weapon configuration with the community.
                </p>
            </div>

            <BuilderForm weapons={weapons} />
        </div>
    );
}
