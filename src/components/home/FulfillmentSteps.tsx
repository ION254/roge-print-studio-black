const steps = [
  { n: '01', title: 'Design', text: 'Pick a blank and drop in your artwork with our online designer.' },
  { n: '02', title: 'Order', text: 'Choose sizes and quantity — from one piece. Pay securely at checkout.' },
  { n: '03', title: 'We produce', text: 'Your order is printed, quality checked and packed by our production partners.' },
  { n: '04', title: 'Delivered', text: 'Track progress in your profile until it lands at your door.' },
];

const FulfillmentSteps = () => (
  <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h2 className="text-4xl font-black max-w-xl">From idea to doorstep in four steps.</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border mt-10 rounded-2xl overflow-hidden border border-border">
      {steps.map((s) => (
        <div key={s.n} className="bg-background p-8">
          <span className="font-display text-sm font-bold text-muted-foreground">{s.n}</span>
          <h3 className="text-2xl font-extrabold mt-6">{s.title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{s.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FulfillmentSteps;
