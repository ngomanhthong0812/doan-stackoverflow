import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/frontend-lag")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-[120vh] pl-3">
      <iframe
        src={`/dsa/lab.html`}
        className="w-full h-full border rounded"
        title={"Frontend Lab"}
      />
    </div>
  );
}
