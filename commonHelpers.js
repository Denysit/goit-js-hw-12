import{a as v,i as p,S as g}from"./assets/vendor-c145bea9.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const b=v.create({baseURL:"https://pixabay.com/api/",params:{key:"41633959-4ab3a3c79df0d7e6ffc2251eb",image_type:"photo",orientation:"horizontal",safesearch:"true"}}),w=document.querySelector(".form"),u=document.querySelector(".photo-container"),f=document.querySelector(".loader"),l=document.querySelector(".button-load-more");let h,i=1,y=40,c="",d=1;const L=async(r="")=>{try{const e=await b.get("",{params:{q:r,page:i,per_page:y}});if(e.status===200)return d=Math.ceil(e.data.totalHits/y),e.data;throw new Error(`Request failed with status ${e.status}`)}catch(e){throw console.error("Error fetching data:",e),new Error("Error fetching data")}};function S(){var s;const e=2*(((s=document.querySelector(".photo-card"))==null?void 0:s.getBoundingClientRect().height)||0);window.scrollBy({top:e,behavior:"smooth"})}w.addEventListener("submit",async r=>{r.preventDefault();const e=r.currentTarget.elements[0].value;if(e.length<3)alert("Sorry, Yours length is not enough. Min 4 letters.");else try{c=e.toLowerCase(),i=1,await m(c)}catch(s){console.error(s)}});async function m(r){try{l.style.display="none";const e=await L(r);e.hits.length===0&&i===1&&p.error({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"}),i===1&&(u.innerHTML="");const s=e.hits.map((a,t)=>`<div class="photo-card">
          <div class="photo">
            <a href="${a.largeImageURL}" data-lightbox="gallery-${t}">
              <img src="${a.webformatURL}" alt="${a.tags}" width="360" height="200" />
            </a>
          </div>
          <div class="info">
            <div class="label-value">
              <div class="label">Likes</div>
              <div class="value">${a.likes}</div>
            </div>
            <div class="label-value">
              <div class="label">Views</div>
              <div class="value">${a.views}</div>
            </div>
            <div class="label-value">
              <div class="label">Comments</div>
              <div class="value">${a.comments}</div>
            </div>
            <div class="label-value">
              <div class="label">Downloads</div>
              <div class="value">${a.downloads}</div>
            </div>
          </div>
        </div>`).join("");u.insertAdjacentHTML("beforeend",s),h=new g(".photo a",{captionsData:"alt",captionPosition:"bottom",captionDelay:250}),h.refresh(),i>1&&S(),i<d&&(l.style.display="inline")}catch(e){console.error(e)}}l.addEventListener("click",async()=>{i+=1,f.style.display="block";try{await m(c),i>=d&&(p.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"}),l.style.display="none")}catch(r){console.error(r)}finally{f.style.display="none"}});
//# sourceMappingURL=commonHelpers.js.map
