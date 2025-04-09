import MainLayout from '@/components/layout/MainLayout';

export default function FamilyBreederTemplate() {
  return (
    <MainLayout>
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">[Kennel Name]</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">[Family breeder mission statement]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Our Puppies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">[Puppy 1]</div>
          <div className="border rounded-lg p-4">[Puppy 2]</div>
          <div className="border rounded-lg p-4">[Puppy 3]</div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Our Dogs</h2>
        <p>[Profiles of breeding dogs]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Puppy Application</h2>
        <p>[Application form and process]</p>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Testimonials</h2>
        <p>[Puppy buyer testimonials]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Contact Us</h2>
        <p>[Inquiry form for puppy availability]</p>
      </section>
    </MainLayout>
  );
}
