import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GoogleSignIn from '@/components/GoogleSignIn'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              width={32}
              height={32}
              alt="Hackathon Platform Logo"
              className="rounded"
            />
            <span className="text-xl font-bold">HackathonHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" scroll={false}>
              Features
            </Link>
            <Link
              href="#competitions"
              className="text-sm font-medium hover:underline underline-offset-4"
              scroll={false}
            >
              Competitions
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              About Us
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Welcome to Our Hackathon Platform
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Join us to collaborate, innovate, and build amazing projects together.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button>Get Started</Button>
                  <Button variant="outline">Learn More</Button>
                </div>
                <div className="mt-4">
                  <GoogleSignIn />
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=550&width=550"
                width={550}
                height={550}
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Login Options Section */}
        <section id="login-options" className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Choose Your Path</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Access the platform based on your role and start your journey with us.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="flex flex-col items-center text-center p-6">
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Students</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Register for hackathons, submit projects, and track your progress
                  </p>
                  <Link href="/auth/login?role=student">
                    <Button className="w-full">Login as Student</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center text-center p-6">
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M8 7h6" />
                      <path d="M8 11h8" />
                      <path d="M8 15h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Teachers</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Manage workshops, review submissions, and track student performance
                  </p>
                  <Link href="/auth/login?role=teacher">
                    <Button className="w-full">Login as Teacher</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center text-center p-6">
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 2H2v10h10V2Z" />
                      <path d="M12 12H2v10h10V12Z" />
                      <path d="M22 2h-10v10h10V2Z" />
                      <path d="M22 12h-10v10h10V12Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Administrators</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Create hackathons, manage users, and oversee the entire platform
                  </p>
                  <Link href="/auth/login?role=admin">
                    <Button className="w-full">Login as Admin</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 bg-muted">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What We Offer</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our platform provides a comprehensive suite of tools for hackathon management and participation.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Hackathon Management</h3>
                  <p className="text-muted-foreground mt-2">
                    Create, manage, and track hackathons with ease. Set deadlines, review submissions, and announce
                    winners.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Workshop Platform</h3>
                  <p className="text-muted-foreground mt-2">
                    Conduct interactive workshops, share resources, and engage with participants in real-time.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Project Submission</h3>
                  <p className="text-muted-foreground mt-2">
                    Submit projects, receive feedback, and showcase your work to the community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Workshops Section */}
        <section id="competitions" className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Competitions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Participate in our exciting hackathons and competitions to showcase your skills.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=250&width=500&text=Workshop+${i}`}
                      width={500}
                      height={250}
                      alt={`Workshop ${i}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Web Development Masterclass</h3>
                    <p className="text-muted-foreground mb-4">
                      Learn the latest web development techniques from industry experts.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">June 15, 2023</span>
                      <Button variant="outline" size="sm">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Competitions</Button>
            </div>
          </div>
        </section>
        {/* About Us Section */}
        <section id="about" className="py-12 md:py-24 bg-muted">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Learn more about our mission and the team behind HackathonHub.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    We aim to foster innovation and collaboration by providing a platform for students to showcase their
                    skills and learn from industry experts through hackathons and competitions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To create a global community of innovators who use technology to solve real-world problems and drive
                    positive change in society.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Our Team</h3>
                  <p className="text-muted-foreground">
                    We are a team of educators, developers, and industry professionals passionate about technology
                    education and innovation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            2023 HackathonHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
