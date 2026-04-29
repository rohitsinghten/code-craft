import Header from "./_components/Header";
import ResizableWorkspace from "./_components/ResizableWorkspace";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <ResizableWorkspace />
      </div>
    </div>
  );
}
