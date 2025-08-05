"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Menu,
  X,
  Code,
  Palette,
  Smartphone,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const slideInFromBottom = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
}

// Molecule Animation Component
const MoleculeAnimation = () => {
  const [atoms, setAtoms] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; size: number }>>(
    [],
  )
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const atomCount = 35
    const speed = 1.5 // Constant speed
    const newAtoms = Array.from({ length: atomCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2 // Random direction
      return {
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 1,
      }
    })
    setAtoms(newAtoms)

    const animateAtoms = () => {
      setAtoms((prevAtoms) =>
        prevAtoms.map((atom) => ({
          ...atom,
          x: (atom.x + atom.vx + dimensions.width) % dimensions.width,
          y: (atom.y + atom.vy + dimensions.height) % dimensions.height,
        })),
      )
    }

    const interval = setInterval(animateAtoms, 16)
    return () => clearInterval(interval)
  }, [dimensions])

  const addNewAtoms = (clickX: number, clickY: number) => {
    const speed = 1.5 // Constant speed
    const newAtoms = Array.from({ length: 4 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2 // Random direction
      return {
        id: Date.now() + i,
        x: clickX + (Math.random() - 0.5) * 100,
        y: clickY + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
      }
    })

    setAtoms((prevAtoms) => [...prevAtoms, ...newAtoms])
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    addNewAtoms(clickX, clickY)
  }

  const getConnections = () => {
    const connections: Array<{ from: (typeof atoms)[0]; to: (typeof atoms)[0]; distance: number; opacity: number }> = []
    const maxDistance = 150
    const minDistance = 20

    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const dx = atoms[i].x - atoms[j].x
        const dy = atoms[i].y - atoms[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && !isNaN(distance)) {
          // Calculate opacity based on distance - closer = more opaque
          const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance)
          const opacity = Math.max(0, Math.min(1, 1 - normalizedDistance)) * 0.6

          connections.push({
            from: atoms[i],
            to: atoms[j],
            distance,
            opacity,
          })
        }
      }
    }

    return connections
  }

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-auto cursor-pointer" onClick={handleClick}>
      <svg className="w-full h-full">
        {/* Connections with dynamic opacity */}
        {getConnections().map((connection, index) => (
          <motion.line
            key={`connection-${index}`}
            x1={isNaN(connection.from.x) ? 0 : connection.from.x}
            y1={isNaN(connection.from.y) ? 0 : connection.from.y}
            x2={isNaN(connection.to.x) ? 0 : connection.to.x}
            y2={isNaN(connection.to.y) ? 0 : connection.to.y}
            stroke={`rgba(255, 255, 255, ${connection.opacity})`}
            strokeWidth={connection.opacity > 0.3 ? "1" : "0.5"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* Atoms */}
        {atoms.map((atom) => (
          <motion.circle
            key={atom.id}
            cx={isNaN(atom.x) ? 0 : atom.x}
            cy={isNaN(atom.y) ? 0 : atom.y}
            r={isNaN(atom.size) ? 1 : atom.size}
            fill="rgba(255, 255, 255, 0.8)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: atom.id < 50 ? atom.id * 0.01 : 0 }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "resume", "projects", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "C++", icon: <Code className="w-6 h-6" /> },
        { name: "JavaScript(Node.js, React.js, Next.js)", icon: <Code className="w-6 h-6" /> },
        { name: "Python", icon: <Code className="w-6 h-6" /> },
        { name: "Java", icon: <Code className="w-6 h-6" /> },
        { name: "HTML", icon: <Code className="w-6 h-6" /> },
        { name: "CSS", icon: <Code className="w-6 h-6" /> },
        { name: "MySQL", icon: <Code className="w-6 h-6" /> },
        { name: "C", icon: <Code className="w-6 h-6" /> },
      ],
    },
    {
      title: "Core Subjects",
      skills: [
        { name: "OOPS", icon: <Globe className="w-6 h-6" /> },
        { name: "Computer Networks", icon: <Globe className="w-6 h-6" /> },
        { name: "Operating Systems", icon: <Globe className="w-6 h-6" /> },
        { name: "Computer Architecture", icon: <Globe className="w-6 h-6" /> },
        { name: "DSA", icon: <Code className="w-6 h-6" /> },
        { name: "DBMS", icon: <Globe className="w-6 h-6" /> },
      ],
    },
    {
      title: "Others",
      skills: [
        { name: "Github", icon: <Globe className="w-6 h-6" /> },
        { name: "Matlab", icon: <Globe className="w-6 h-6" /> },
        { name: "AWS", icon: <Globe className="w-6 h-6" /> },
        { name: "Extensible Markup language(XML)", icon: <Code className="w-6 h-6" /> },
        { name: "Git", icon: <Globe className="w-6 h-6" /> },
        { name: "RStudio", icon: <Smartphone className="w-6 h-6" /> },
        { name: "Assembly language", icon: <Code className="w-6 h-6" /> },
      ],
    },
  ]

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and MongoDB",
      image: "/placeholder.svg?height=200&width=300&text=E-Commerce+Platform",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      image: "/placeholder.svg?height=200&width=300&text=Task+Management+App",
      technologies: ["Next.js", "Socket.io", "PostgreSQL", "Tailwind"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Weather Dashboard",
      description: "A responsive weather dashboard with location-based forecasts",
      image: "/placeholder.svg?height=200&width=300&text=Weather+Dashboard",
      technologies: ["React", "OpenWeather API", "Chart.js", "CSS3"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen transition-colors duration-300 bg-white text-gray-900"
    >
      {/* Navigation - Blended with home page background */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-600/80 via-blue-700/80 to-blue-800/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white"
            >
              Portfolio
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["home", "about", "skills", "resume", "projects", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors duration-200 text-white/90 hover:text-white ${
                    activeSection === section ? "text-white font-semibold" : ""
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button className="p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-blue-800/90 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-4 py-2 space-y-2">
                {["home", "about", "skills", "resume", "projects", "contact"].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block w-full text-left py-2 px-4 capitalize text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {section}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Molecule Animation */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
      >
        {/* Molecule Animation Background */}
        <MoleculeAnimation />

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pointer-events-none">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              {" "}
              <motion.span
                className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "backOut" }}
              >
                Purv Patel
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Programmer • Full Stack Developer • Aspiring AI enthusiast
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(255, 255, 255, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => scrollToSection("projects")}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 pointer-events-auto"
                >
                  View My Work
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-2xl font-semibold mb-6">Passionate Developer</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
              I'm a passionate Information Technology student, eager to dive into the world of software
              development. I love learning new technologies and building projects that solve real-world problems.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                When I'm not studying or coding, you can find me exploring the latest tech trends, participating in
                hackathons, or contributing to open-source projects to enhance my skills.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Ahmedabad, Gujarat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>patelpurv908@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>+91 7383631475</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-6"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <h4 className="text-xl font-semibold mb-3">Education</h4>
                  <p className="text-gray-600">VIT Vellore, 2023-202</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <h4 className="text-xl font-semibold mb-3">Learning Focus</h4>
                  <p className="text-gray-600">Full-stack development, Problem Solving, Modern AI technologies</p>
                </CardContent>
              </Card>
              
              {/* <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <h4 className="text-xl font-semibold mb-3">Academic Projects</h4>
                  <p className="text-gray-600">15+ university & personal projects</p>
                </CardContent> */}

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <h4 className="text-xl font-semibold mb-3">Hobbies</h4>
                  <p className="text-gray-600">Music, Coding, Travelling, Volleyball, Trekking</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </motion.div>

          <div className="space-y-16">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">{category.title}</h3>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.4, ease: "easeOut" },
                        },
                      }}
                      whileHover={{
                        y: -8,
                        rotateY: 5,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-l-4 border-l-blue-500">
                        <CardContent className="p-0">
                          <div className="flex items-center">
                            <motion.div
                              className="p-3 bg-blue-100 rounded-lg mr-4"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {skill.icon}
                            </motion.div>
                            <h4 className="text-lg font-semibold">{skill.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-6"
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Download My Resume
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Get a detailed overview of my experience, education, and skills. My resume includes information about my
                professional background, technical expertise, and notable projects.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Resume Preview */}
              <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <div className="w-64 h-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6 relative overflow-hidden">
                  {/* Header section */}
                  <div className="w-full h-6 bg-blue-500 rounded mb-4"></div>

                  {/* Content lines */}
                  <div className="space-y-3">
                    <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
                    <div className="w-full h-2 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-2 bg-gray-200 rounded"></div>
                    <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                  </div>

                  {/* Section divider */}
                  <div className="w-full h-1 bg-gray-300 rounded my-6"></div>

                  {/* More content */}
                  <div className="space-y-2">
                    <div className="w-4/5 h-2 bg-gray-200 rounded"></div>
                    <div className="w-full h-2 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-2 bg-gray-200 rounded"></div>
                  </div>

                  {/* Another section */}
                  <div className="w-full h-1 bg-gray-300 rounded my-6"></div>

                  <div className="space-y-2">
                    <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                    <div className="w-4/5 h-2 bg-gray-200 rounded"></div>
                    <div className="w-full h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </motion.div>

              {/* Download Button */}
              <motion.div
                className="text-center space-y-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                    onClick={() => window.open('https://drive.google.com/file/d/11zKkQxvmbHQlYbHvpcYC6rLUWhpKJ3QE/view', '_blank')}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Resume</span>
                  </Button>
                </motion.div>

                <p className="text-sm text-gray-500">PDF • 1 page(s) • Last updated: Nov 2024</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                    <motion.img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects. Let's create something amazing
            together!
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-8 max-w-md mx-auto"
          >
            <div>
              <motion.h3
                className="text-2xl font-semibold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                Let's connect
              </motion.h3>
              <div className="space-y-4">
                {/* Email Card */}
                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300"
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <Mail className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <div>
                    <p className="font-semibold group-hover:text-blue-600 transition-colors duration-300">Email</p>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    patelpurv908@gmail.com
                    </p>
                  </div>
                </motion.div>

                {/* Phone Card */}
                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300"
                    whileHover={{
                      rotate: [0, 15, -15, 15, 0],
                      transition: { duration: 0.6 },
                    }}
                  >
                    <Phone className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <div>
                    <p className="font-semibold group-hover:text-blue-600 transition-colors duration-300">Phone</p>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      +91 73836 31475
                    </p>
                  </div>
                </motion.div>

                {/* Location Card */}
                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300"
                    whileHover={{
                      y: [0, -3, 0, -3, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <div>
                    <p className="font-semibold group-hover:text-blue-600 transition-colors duration-300">Location</p>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      Ahmedabad, Gujarat
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div>
              <motion.h4
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                Follow me
              </motion.h4>
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-blue-600 hover:text-white transition-colors bg-transparent hover:border-blue-600"
                    onClick={() => window.open('https://github.com/Purv007', '_blank')}

                  >
                    <Github className="w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: -5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-blue-600 hover:text-white transition-colors bg-transparent hover:border-blue-600"
                    onClick={() => window.open('https://www.linkedin.com/in/purv-patel-b31a84280/', '_blank')}
                  >
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-blue-600 hover:text-white transition-colors bg-transparent hover:border-blue-600"
                    onClick={() => window.open('mailto:patelpurv908@gmail.com', '_blank')}

                  >
                    <Mail className="w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Purv Patel. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  )
}
