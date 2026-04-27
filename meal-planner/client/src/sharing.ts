export function shareOnTwitter(mealName: string, mealUrl: string) {
  const text = `🍽️ Check out my meal: ${mealName}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(mealUrl)}`;
  window.open(url, '_blank', 'width=500,height=400');
}

export function shareOnFacebook(mealUrl: string) {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mealUrl)}`;
  window.open(url, '_blank', 'width=500,height=400');
}

export function shareOnPinterest(mealName: string, imageUrl: string, mealUrl: string) {
  const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(mealUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(mealName)}`;
  window.open(url, '_blank', 'width=500,height=400');
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
