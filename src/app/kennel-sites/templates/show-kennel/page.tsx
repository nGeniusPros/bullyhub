import MainLayout from '@/components/layout/MainLayout';

export default function ShowKennelTemplate() {
  return (
    <MainLayout>
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">[Kennel Name]</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">[Show kennel mission statement]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Our Champions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">[Champion Dog 1]</div>
          <div className="border rounded-lg p-4">[Champion Dog 2]</div>
          <div className="border rounded-lg p-4">[Champion Dog 3]</div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Show Calendar</h2>
        <p>[Upcoming events and show schedule]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Show Results</h2>
        <p>[Blog or updates on recent show results]</p>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Stud Services</h2>
        <p>[Stud service details, competition pedigrees]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Contact Us</h2>
        <p>[Inquiry form for show prospects]</p>
      </section>
    </MainLayout>
  );
}
