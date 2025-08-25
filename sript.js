// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  }),
)

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      // Calculate offset to account for fixed navbar
      const navbarHeight = document.querySelector(".navbar").offsetHeight
      const targetPosition = target.offsetTop - navbarHeight - 20 // Extra 20px padding

      // Add active state to clicked link
      document.querySelectorAll(".nav-menu a").forEach((link) => link.classList.remove("scrolling"))
      this.classList.add("scrolling")

      // Smooth scroll with custom easing
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })

      // Remove active state after scroll completes
      setTimeout(() => {
        this.classList.remove("scrolling")
      }, 1000)
    }
  })
})

// Navbar background change on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(245, 241, 235, 0.98)"
    navbar.style.boxShadow = "0 2px 20px rgba(139, 111, 71, 0.1)"
  } else {
    navbar.style.background = "rgba(245, 241, 235, 0.95)"
    navbar.style.boxShadow = "none"
  }
})

// Skill bars animation
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width")
    bar.style.width = "0%"

    setTimeout(() => {
      bar.style.width = width
    }, 500)
  })
}

// Intersection Observer for skill bars
const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars()
        skillsObserver.unobserve(entry.target) // Only animate once
      }
    })
  },
  { threshold: 0.5 },
)

// Form submission with Formspree
const contactForm = document.getElementById("contactForm")
const submitBtn = contactForm.querySelector(".submit-btn")

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Show loading state
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  // Get form data
  const formData = new FormData(contactForm)
  const formObject = Object.fromEntries(formData)

  try {
    // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
    const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    })

    if (response.ok) {
      // Success
      showNotification("Message sent successfully! I'll get back to you soon.", "success")
      contactForm.reset()
    } else {
      throw new Error("Form submission failed")
    }
  } catch (error) {
    // Error
    showNotification("Sorry, there was an error sending your message. Please try again.", "error")
    console.error("Form submission error:", error)
  } finally {
    // Reset button state
    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
  }
})

// Notification system
function showNotification(message, type) {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  // Add styles with theme colors
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#8B6F47" : "#D2691E"};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(139, 111, 71, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease forwards;
        max-width: 400px;
    `

  // Add animation styles
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `
  document.head.appendChild(style)

  // Add to page
  document.body.appendChild(notification)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    notification.remove()
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease forwards"
    }
  })
}, observerOptions)

// Counter animation for stats
function animateCounters() {
  const counters = document.querySelectorAll(".stat-content h4")

  counters.forEach((counter) => {
    const target = counter.textContent
    const isPercentage = target.includes("%")
    const isPlus = target.includes("+")
    const numericValue = Number.parseInt(target.replace(/[^\d]/g, ""))

    let current = 0
    const increment = numericValue / 50 // Adjust speed

    const updateCounter = () => {
      if (current < numericValue) {
        current += increment
        const displayValue = Math.ceil(current)

        if (isPercentage) {
          counter.textContent = displayValue + "%"
        } else if (isPlus) {
          counter.textContent = displayValue + "+"
        } else {
          counter.textContent = displayValue
        }

        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target // Ensure final value is exact
      }
    }

    updateCounter()
  })
}

// Stats counter observer
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters()
        statsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".service-card, .about-content, .contact-content")
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    observer.observe(el)
  })

  // Observe skills section for skill bar animation
  const skillsSection = document.querySelector(".skills-section")
  if (skillsSection) {
    skillsObserver.observe(skillsSection)
  }

  // Observe stats section for counter animation
  const statsSection = document.querySelector(".stats-grid")
  if (statsSection) {
    statsObserver.observe(statsSection)
  }
})

// Add loading animation to page
window.addEventListener("load", () => {
  document.body.style.opacity = "1"
})

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.3s ease"
})
