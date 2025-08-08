export default function Home() {
  return (
    <main className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">DaisyUI Verification</h1>
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Card Component</h2>
          <p>If you see styled card padding and background, DaisyUI works.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn">Default</button>
          </div>
        </div>
      </div>
    </main>
  );
}
