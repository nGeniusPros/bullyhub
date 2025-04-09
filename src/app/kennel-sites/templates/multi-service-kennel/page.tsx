import MainLayout from '@/components/layout/MainLayout';

export default function MultiServiceKennelTemplate() {
  return (
    <MainLayout>
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">[Kennel Name]</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">[Multi-service kennel mission statement]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">[Breeding Service]</div>
          <div className="border rounded-lg p-4">[Training Service]</div>
          <div className="border rounded-lg p-4">[Boarding Service]</div>
          <div className="border rounded-lg p-4">[Other Service]</div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Book a Service</h2>
        <p>[Booking form or system]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Our Team</h2>
        <p>[Staff and team member profiles]</p>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Facility Tour</h2>
        <p>[Virtual tour or gallery]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Contact Us</h2>
        <p>[Inquiry form for services]</p>
      </section>
    </MainLayout>
  );
}
