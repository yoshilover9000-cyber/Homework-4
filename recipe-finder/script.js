// ── Get references to the HTML elements we need ─────────────
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const statusMsg = document.getElementById('status-msg');

// ── Main search function ─────────────────────────────────────
async function searchRecipes() {
  const query = searchInput.value.trim();
  if (query === '') {
    statusMsg.textContent = 'Please enter something to search for.';
    return;
  }
  searchBtn.disabled = true;
  searchBtn.textContent = 'Searching...';
  statusMsg.textContent = '⏳ Loading recipes...';
  resultsDiv.innerHTML = '';
  try {
    const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + query;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Server error: ' + response.status);
    }
    const data = await response.json();
    if (data.meals === null) {
      statusMsg.textContent = 'No recipes found for "' + query + '".';
    } else {
      statusMsg.textContent = data.meals.length + ' recipes found:';
      displayMeals(data.meals);
    }
  } catch (error) {
    statusMsg.textContent = '❌ Something went wrong: ' + error.message;
  }
  searchBtn.disabled = false;
  searchBtn.textContent = 'Search';
}

// ── Display one card per meal ─────────────────────────────────
function displayMeals(meals) {
  for (let i = 0; i < meals.length; i++) {
    const meal = meals[i];
    let videoButton = '';
    if (meal.strYoutube) {
      videoButton = `<a class="watch-btn" href="${meal.strYoutube}" target="_blank">▶ Watch Recipe</a>`;
    }
    const card = `
      <div class="meal-card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="card-body">
          <h3>${meal.strMeal}</h3>
          <p class="card-meta">🌍 ${meal.strArea}</p>
          <p class="card-meta">🍽️ ${meal.strCategory}</p>
          ${videoButton}
        </div>
      </div>
    `;
    resultsDiv.innerHTML += card;
  }
}

// ── Connect events ────────────────────────────────────────────
searchBtn.addEventListener('click', searchRecipes);
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') searchRecipes();
});