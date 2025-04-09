import MainLayout from '@/components/layout/MainLayout';

export default function ProfessionalBreederTemplate() {
  return (
    <MainLayout>
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">[Kennel Name]</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">[Kennel mission statement]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Featured Dogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">[Dog 1 Profile]</div>
          <div className="border rounded-lg p-4">[Dog 2 Profile]</div>
          <div className="border rounded-lg p-4">[Dog 3 Profile]</div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Stud Services</h2>
        <p>[Stud service details, DNA data integration]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Breeding Program</h2>
        <p>[Breeding program info, pedigrees, upcoming litters]</p>
      </section>

      <section className="py-16 md:py-24 bg-muted container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Testimonials</h2>
        <p>[Customer testimonials]</p>
      </section>

      <section className="py-16 md:py-24 container space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Contact Us</h2>
        <p>[Contact form]</p>
      </section>
    </MainLayout>
  );
}
