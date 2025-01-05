import "./App.css";
import { Input } from "@/components/ui/input"

function App() {
  return (
    <main className="w-full h-screen flex justify-center items-center bg-slate-200">
      <section className="rounded-xl w-[600px] h-[400px] bg-white">
      <p>Recommended</p>
      <Input className="w-[400px]" type="email" placeholder="Eemail" />
      </section>
    </main>
  );
}

export default App;
