// MOBILE MENU

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// FAQ ACCORDION

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {

    item.classList.toggle("active");

  });

});

// SCROLL ANIMATION

const cards = document.querySelectorAll(
  ".service-card, .stat-card, .testimonial-card"
);

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if(entry.isIntersecting){

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0px)";

    }

  });

},{
  threshold:0.2
});

cards.forEach(card => {

  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "0.6s ease";

  observer.observe(card);

});
// simple form alert
document.querySelectorAll(".form").forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
  });
});