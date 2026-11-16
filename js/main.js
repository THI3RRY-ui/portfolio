// Shortcuts for selecting elements
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// Mobile menu: open and close the hamburger menu
const menuButton = $("#mb");
menuButton.onclick = () => {
  const isOpen = $("nav.top").classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
};

// Home page: words in the statement light up one by one as you scroll
const statement = $(".say");
if (statement) {
  const words = statement.textContent.trim().split(/\s+/);
  statement.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");

  const wordElements = $$(".say span");
  const lightUpWords = () => {
    const triggerLine = window.innerHeight * 0.72;
    wordElements.forEach((word) => {
      word.classList.toggle("on", word.getBoundingClientRect().top < triggerLine);
    });
  };

  addEventListener("scroll", lightUpWords, { passive: true });
  lightUpWords();
}

// Counters: numbers count up once when they scroll into view
$$("[data-c]").forEach((counter) => {
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();

    const target = Number(counter.dataset.c);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased) + "+";
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  observer.observe(counter);
});

// Developer page: filter projects with the buttons
const filters = $(".chips");
if (filters) {
  filters.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") return;

    $$(".chips button").forEach((button) => {
      button.classList.toggle("on", button === event.target);
    });

    const chosen = event.target.textContent;
    $$(".list a").forEach((row) => {
      const matches = chosen === "All" || row.dataset.g.includes(chosen);
      row.style.display = matches ? "" : "none";
    });
  });
}

// TypoFeel page: show the rhythm of typing (gaps between keys, never the words)
const typingBox = $("#ty");
if (typingBox) {
  let lastKeyTime = 0;
  let gaps = [];

  typingBox.onkeydown = () => {
    const now = performance.now();
    if (lastKeyTime) gaps.push(Math.min(now - lastKeyTime, 1200));
    lastKeyTime = now;
    gaps = gaps.slice(-30);

    $("#rh").innerHTML = gaps
      .map((gap) => `<i style="height:${Math.max(4, gap / 11)}px"></i>`)
      .join("");
  };
}

// Contact and Hire pages: check the form, then send by WhatsApp or email
const CONTACT_EMAIL = "mihthierry237@gmail.com";
const contactForm = $("#cf");

if (contactForm) {
  const nameField = $("#nm");
  const topicField = $("#tp");
  const messageField = $("#ms");
  const alertBox = $("#fa");
  const fallbackBox = $("#mf");

  // Each rule returns an error message, or "" when the field is fine
  const checks = [
    [nameField, () => {
      const v = nameField.value.trim();
      return v.length >= 2 && /[a-z\u00C0-\u024F]/i.test(v) ? "" : "Please enter your name.";
    }],
    [topicField, () => (topicField.value ? "" : "Please choose what you need.")],
    [messageField, () => {
      const v = messageField.value.trim();
      return v.length >= 20
        ? ""
        : "Please tell me a bit more about it, at least a couple of full sentences.";
    }],
  ];

  const showError = (field, message) => {
    const slot = $(`#${field.id}-er`);
    slot.textContent = message;
    slot.hidden = !message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validate = () => {
    const results = checks.map(([field, check]) => [field, check()]);
    results.forEach(([field, message]) => showError(field, message));

    const failed = results.filter(([, message]) => message);
    const allEmpty = !nameField.value.trim() && !topicField.value && !messageField.value.trim();

    if (failed.length) {
      alertBox.textContent = allEmpty
        ? "The form is empty. Please fill in your name, what you need and your message, fully and clearly, then send."
        : "Almost there. Please complete the highlighted fields fully, then send.";
      alertBox.hidden = false;
      failed[0][0].focus();
      return false;
    }
    alertBox.hidden = true;
    return true;
  };

  // Clear a field's error as soon as the person starts fixing it
  checks.forEach(([field]) => {
    const clear = () => {
      if (field.getAttribute("aria-invalid") === "true") showError(field, "");
      if (checks.every(([f]) => f.getAttribute("aria-invalid") !== "true")) alertBox.hidden = true;
    };
    field.addEventListener("input", clear);
    field.addEventListener("change", clear);
  });

  const buildDetails = () => {
    const name = nameField.value.trim();
    const topic = topicField.value;
    return {
      subject: `${topic} | ${name}`,
      body: `Hello Thierry,\n\nMy name is ${name} and I need help with: ${topic}.\n\n${messageField.value.trim()}\n\nThank you,\n${name}`,
    };
  };

  // WhatsApp
  $("#sw").onclick = () => {
    if (!validate()) return;
    const { body } = buildDetails();
    window.open(`https://wa.me/237654989932?text=${encodeURIComponent(body)}`, "_blank");
  };

  // Email: open the person's own mail app (phone or computer) with everything filled in
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const box = document.createElement("textarea");
      box.value = text;
      box.style.position = "fixed";
      box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      const ok = document.execCommand("copy");
      box.remove();
      return ok;
    }
  };

  const showFallback = ({ subject, body }) => {
    const to = encodeURIComponent(CONTACT_EMAIL);
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    $("#mf-g").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${s}&body=${b}`;
    $("#mf-o").href = `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${s}&body=${b}`;
    $("#mf-y").href = `https://compose.mail.yahoo.com/?to=${to}&subject=${s}&body=${b}`;
    $("#mf-c").onclick = async () => {
      const ok = await copyText(`To: ${CONTACT_EMAIL}\nSubject: ${subject}\n\n${body}`);
      $("#mf-s").textContent = ok
        ? "Copied. Paste it into any email to " + CONTACT_EMAIL
        : "Could not copy. Please write to " + CONTACT_EMAIL;
    };
    $("#mf-s").textContent = "";
    fallbackBox.hidden = false;
  };

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    fallbackBox.hidden = true;
    if (!validate()) return;

    const details = buildDetails();
    // mailto links want Windows style line breaks to keep paragraphs intact
    const mailBody = details.body.replace(/\n/g, "\r\n");
    const link =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(details.subject)}` +
      `&body=${encodeURIComponent(mailBody)}`;

    // If a mail app opens, this page loses focus. If nothing happens, offer other ways to send.
    let left = false;
    const markLeft = () => (left = true);
    addEventListener("blur", markLeft);
    document.addEventListener("visibilitychange", markLeft);
    location.href = link;
    setTimeout(() => {
      removeEventListener("blur", markLeft);
      document.removeEventListener("visibilitychange", markLeft);
      if (!left) showFallback(details);
    }, 1800);
  });
}

// About page: show a small hint while the story still has more to read
const story = $(".story");
if (story) {
  const hint = $("#storyHint");
  const checkStory = () => {
    const hasMore = story.scrollHeight - story.clientHeight - story.scrollTop > 8;
    hint.classList.toggle("show", hasMore);
  };
  story.addEventListener("scroll", checkStory);
  addEventListener("resize", checkStory);
  checkStory();
}

// Skills page: drag a logo around and it springs back
$$(".tile").forEach((tile) => {
  let startX = 0;
  let startY = 0;
  let dragging = false;

  tile.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    tile.setPointerCapture(event.pointerId);
    tile.classList.add("drag");
    tile.style.transition = "none";
  });
  tile.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    tile.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 30}deg)`;
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    tile.classList.remove("drag");
    tile.style.transition = "transform .5s cubic-bezier(.2, 1.4, .4, 1)";
    tile.style.transform = "";
  };
  tile.addEventListener("pointerup", release);
  tile.addEventListener("pointercancel", release);
});

// Experience page: the journey. Entries are sorted from the oldest start date
// to the most recent, then the line fills as you scroll and each step lights up.
const JOURNEY = [
  {
    from: "2026-12",
    when: "Dec 2026 (expected)",
    type: "Education",
    title: "Graduating with a B.Tech",
    org: "University of Buea",
    text: "Computer Engineering, Software Engineering focus, Data Science option.",
  },
  {
    from: "2025-11",
    when: "Nov 2025 to present",
    type: "Founder",
    title: "Founder and Lead Developer",
    org: "RentVeed",
    text: "A rental platform for Buea, helping students to rent without getting extorted by predatory agents",
  },
  {
    from: "2024-08",
    when: "Aug to Sep 2024 and Jul to Sep 2025",
    type: "Work",
    title: "Software Development Intern",
    org: "Zepstra",
    text: "Built and connected sub-systems that streamlined company operations, and strengthened PHP and MySQL skills.",
  },
  {
    from: "2026-03",
    when: "Mar 2026 to present",
    type: "Leadership",
    title: "Lead Organizer",
    org: "Cre8tive Designers Hub",
    text: "Online graphic design training for 200+ young people so they can earn while in school.",
  },
  {
    from: "2024-01",
    when: "2024 to 2026",
    type: "Leadership",
    title: "Academic Leader",
    org: "Academy Campus Forum (ACF) Buea",
    text: "Led Over 100 students in academic and career development activities, including workshops, study cluster and peer-to-peer studying.",
  },
  {
    from: "2024-01",
    when: "2024 to 2026",
    type: "Leadership",
    title: "Theater Leader",
    org: "Academy Campus Forum (ACF) Buea",
    text: "Led a team of 25+ students in organizing and performing plays helping youths gain more skills.",
  },
  {
    from: "2025-11",
    when: "Nov 2025 to Jul 2026",
    type: "Project",
    title: "Systems and Mobile Software Engineer",
    org: "SafetiDing",
    text: "A Flutter emergency app that sends live location to trusted contacts. About 94% success across 20 trial runs.",
  },
  {
    from: "2025-12",
    when: "Dec 2025 to Aug 2026",
    type: "Project",
    title: "AI Developer and ML Engineer",
    org: "TypoFeel",
    text: "Estimates mood from typing rhythm without reading what is typed.",
  },
  {
    from: "2026-08",
    when: "Aug to Sep 2026",
    type: "Client work",
    title: "Web Developer",
    org: "Africsis and Lion Force Investment",
    text: "Built both organization websites from start to finish.",
  },
  {
    from: "2024-01",
    when: "2024 to present",
    type: "Design",
    title: "Graphic Designer",
    org: "ACF Buea",
    text: "10+ designs that widened the fellowship's reach to local youth.",
  },
];

const journeyList = $("#jlist");
if (journeyList) {
  // Sort by start date, oldest first (ties keep their order)
  const sorted = JOURNEY.map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.from.localeCompare(b.item.from) || a.index - b.index)
    .map((entry) => entry.item);

  let lastYear = "";
  journeyList.innerHTML = sorted
    .map((step) => {
      const year = step.from.slice(0, 4);
      const marker = year !== lastYear ? `<li class="yr">${year}</li>` : "";
      lastYear = year;
      return `${marker}
      <li>
        <span class="jd">${step.when}</span><span class="jt">${step.type}</span>
        <h3>${step.title}</h3>
        <div class="jo">${step.org}</div>
        <p>${step.text}</p>
      </li>`;
    })
    .join("");

  const track = $("#jr");
  const fill = $("#jf");
  const steps = $$("#jlist li");
  const updateJourney = () => {
    const box = track.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.6 - box.top) / box.height));
    fill.style.height = `${progress * 100}%`;
    steps.forEach((step) => {
      step.classList.toggle("on", step.offsetTop / box.height <= progress + 0.01);
    });
  };
  addEventListener("scroll", updateJourney, { passive: true });
  addEventListener("resize", updateJourney);
  updateJourney();
}
