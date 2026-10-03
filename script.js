const data = window.KZ_CULTURE_DATA;

const grid = document.querySelector('#sections-grid');
const sourcesList = document.querySelector('#sources-list');
const filters = [...document.querySelectorAll('.filter')];
const siteTitle = document.querySelector('#site-title');
const siteSubtitle = document.querySelector('#site-subtitle');

siteTitle.textContent = data.title;
siteSubtitle.textContent = data.subtitle;

data.sections.forEach((section, index) => {
  grid.appendChild(createSectionCard(section, index));
});

data.sources.forEach((source) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = source.url;
  a.target = '_blank';
  a.rel = 'noreferrer noopener';
  a.textContent = source.label;
  li.appendChild(a);
  sourcesList.appendChild(li);
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.section-card').forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden-by-filter', !show);
    });
  });
});

function createSectionCard(section, index) {
  const article = document.createElement('article');
  article.className = `section-card theme-${section.theme}`;
  article.dataset.sectionId = section.id;
  article.dataset.category = section.category;
  article.tabIndex = 0;
  article.setAttribute('aria-labelledby', `${section.id}-title`);

  const closeButton = document.createElement('button');
  closeButton.className = 'close-card';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', `${section.title} бөлімін жабу`);
  closeButton.innerHTML = '<span aria-hidden="true">×</span> Жабу';
  article.appendChild(closeButton);

  const cover = document.createElement('div');
  cover.className = 'card-cover';
  const img = document.createElement('img');
  img.src = section.cover;
  img.alt = `${section.title} бөлімінің көрнекі суреті`;
  img.loading = index < 4 ? 'eager' : 'lazy';
  cover.appendChild(img);

  const badge = document.createElement('span');
  badge.className = 'card-badge';
  badge.textContent = `${section.category} · ${formatPages(section.pages)}`;
  cover.appendChild(badge);
  article.appendChild(cover);

  const body = document.createElement('div');
  body.className = 'card-body';

  const meta = document.createElement('div');
  meta.className = 'card-meta';
  const cat = document.createElement('span');
  cat.textContent = section.category;
  const icon = document.createElement('span');
  icon.className = 'card-icon';
  icon.textContent = section.icon;
  icon.setAttribute('aria-hidden', 'true');
  meta.append(cat, icon);

  const title = document.createElement('h2');
  title.className = 'card-title';
  title.id = `${section.id}-title`;
  title.textContent = section.title;

  const summary = document.createElement('p');
  summary.className = 'card-summary';
  summary.textContent = section.summary;

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const open = document.createElement('span');
  open.className = 'open-mini';
  open.textContent = 'Толық экранда ашу';
  const count = document.createElement('span');
  count.className = 'page-count';
  count.textContent = `${section.visuals.length} материал`;
  footer.append(open, count);

  body.append(meta, title, summary, footer, createExpandedContent(section));
  article.appendChild(body);

  article.addEventListener('click', (event) => {
    if (event.target.closest('.close-card')) {
      closeSection(article);
      return;
    }
    if (event.target.closest('a') || article.classList.contains('active')) return;
    openSection(article);
  });

  article.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && !article.classList.contains('active')) {
      event.preventDefault();
      openSection(article);
    }
  });

  return article;
}

function createExpandedContent(section) {
  const wrapper = document.createElement('div');
  wrapper.className = 'expanded-content';

  const explanationBlock = document.createElement('div');
  explanationBlock.className = 'expand-block';
  const explanationTitle = document.createElement('h3');
  explanationTitle.textContent = 'Түсіндірме мәтін';
  const explanationCard = document.createElement('article');
  explanationCard.className = 'explanation-card';
  const explanationText = document.createElement('p');
  explanationText.textContent = section.explanation;
  explanationCard.appendChild(explanationText);
  explanationBlock.append(explanationTitle, explanationCard);
  wrapper.appendChild(explanationBlock);

  const galleryBlock = document.createElement('div');
  galleryBlock.className = 'expand-block';
  const galleryTitle = document.createElement('h3');
  galleryTitle.textContent = 'Көрнекі материалдар';
  const gallery = document.createElement('div');
  gallery.className = 'visual-gallery';

  section.visuals.forEach((item, index) => {
    const figure = document.createElement('figure');
    const link = document.createElement('a');
    link.href = item.image;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = `${section.title}: көрнекі материал ${index + 1}`;
    image.loading = 'lazy';
    link.appendChild(image);
    const caption = document.createElement('figcaption');
    caption.textContent = `Көрнекі материал ${index + 1}`;
    figure.append(link, caption);
    gallery.appendChild(figure);
  });
  galleryBlock.append(galleryTitle, gallery);
  wrapper.appendChild(galleryBlock);

  if (section.supplement && section.supplement.length) {
    const supBlock = document.createElement('div');
    supBlock.className = 'expand-block';
    const supTitle = document.createElement('h3');
    supTitle.textContent = 'Қосымша тексерілген дерек';
    const supList = document.createElement('div');
    supList.className = 'supplement-list';

    section.supplement.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'supplement-card';
      const strong = document.createElement('strong');
      strong.textContent = item.title;
      const p = document.createElement('p');
      p.textContent = item.text;
      const source = document.createElement('a');
      source.href = item.url;
      source.target = '_blank';
      source.rel = 'noreferrer noopener';
      source.textContent = item.source;
      card.append(strong, p, source);
      supList.appendChild(card);
    });
    supBlock.append(supTitle, supList);
    wrapper.appendChild(supBlock);
  }

  return wrapper;
}

function openSection(card) {
  grid.classList.add('has-active');
  card.classList.add('active');
  document.body.classList.add('no-scroll');
  card.querySelector('.close-card').focus({ preventScroll: true });
}

function closeSection(card) {
  card.classList.remove('active');
  grid.classList.remove('has-active');
  document.body.classList.remove('no-scroll');
  card.focus({ preventScroll: true });
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const active = document.querySelector('.section-card.active');
  if (active) closeSection(active);
});

function formatPages(pages) {
  if (!pages.length) return 'бет жоқ';
  const ranges = [];
  let start = pages[0];
  let prev = pages[0];
  for (let i = 1; i <= pages.length; i += 1) {
    const current = pages[i];
    if (current === prev + 1) {
      prev = current;
      continue;
    }
    ranges.push(start === prev ? `${start}` : `${start}–${prev}`);
    start = current;
    prev = current;
  }
  return `${ranges.join(', ')}-бет`;
}
