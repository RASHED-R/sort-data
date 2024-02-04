const sortBtn = document.getElementById('sort-btn');
const phTubeCardContainer = document.getElementById('ph-tube-card-container');
let dataList = [];


// load all categories
const loadAllCategories = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const data = await res.json();
    displayCategoriesName(data.data);
}

const displayCategoriesName = (categories) => {
    const tabContainer = document.getElementById('tab-container');
    categories?.forEach((category, index) => {
        // console.log(category);
        const div = document.createElement('div');
        div.innerHTML = `
            <a onclick = "handleShowCategories('${category?.category_id}')" role="tab" class="tab" data-index="${index}">${category.category}</a>
        `;
        tabContainer.appendChild(div);

        // Add click event listener to each category tab
        div.querySelector('.tab').addEventListener('click', () => {
            setActiveCategory(index);
        });
    });

    // Activate the first category by default
    setActiveCategory(0);
}

const setActiveCategory = (index) => {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab, i) => {
        if (i === index) {
            tab.classList.add('active');
            tab.style.backgroundColor = '#00f';
            tab.style.color = '#fff';
        } else {
            tab.classList.remove('active');
            tab.style.backgroundColor = '';
            tab.style.color = '#333';
        }
    });
    // console.log(index);

}
const handleShowCategories = async (categoryId) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
    const data = await res.json();
    const phTubeCategories = data.data;
    dataList = phTubeCategories || [];

    loadView(dataList);

    // const eH3 = document.createElement('h3');

    // if (phTubeCategories.length == 0) {
    //     // console.log(phTubeCategories);

    //     eH3.innerHTML = "no data found";
    //     phTubeCardContainer.appendChild(eH3);
    // }
};
const loadView = (data) => {

    phTubeCardContainer.innerHTML = "";
    data?.forEach(phTubeCategory => {



        const postedDate = phTubeCategory?.others?.posted_date;
        const formattedDate = formatPostedDate(postedDate);

        const div = document.createElement('div');

        // Check if formattedDate is NaN or empty
        const shouldShowDate = formattedDate?.trim() !== '';

        div.innerHTML = `
            <div class="card bg-base-100 shadow-xl">
                <figure><img class ="h-48 w-full" src="${phTubeCategory?.thumbnail}" alt="" /></figure>
                <div class="card-body gap-0 relative">
                    ${shouldShowDate ? `<h2>
                        <div class="p-2 rounded-lg text-base badge-secondary absolute -top-12 right-4 leading-0">${formattedDate}</div>
                    </h2>` : ''}
                    <div class=" flex justify-between">
                        <div class = " w-1/6">
                            <img class =" h-14 rounded-full w-full" src="${phTubeCategory?.authors[0]?.profile_picture}" alt="" />
                        </div>
                        <div class = " w-3/4">
                            <h3 class = " text-xl font-bold">${phTubeCategory?.title}</h3>
                            <div class=" flex justify-start items-center">
                                <p class =" my-4 text-lg font-bold">${phTubeCategory?.authors[0]?.profile_name}</p>
                                <p>${phTubeCategory?.authors[0]?.verified ? '<img class =" h-8 w-8" src="./7641727.png" alt="Verified">' : ' '}</p>
                            </div>
                            <p>Total views: ${phTubeCategory?.others?.views || 'No Views'}</p>
                        </div>
                    </div>
                    
                    <div class="card-actions justify-end">
                        <button class="btn" onclick="handleModal('${phTubeCategory?._id}')">Show Details</button>
                    </div>
                </div>
            </div>
        `;

        phTubeCardContainer.appendChild(div);
    });
}
const formatPostedDate = (postedDate) => {
    // Check if postedDate is not available, empty, or NaN
    if (!postedDate || isNaN(Date.parse(postedDate))) {
        return ''; // Return an empty string or handle as needed
    }

    // Convert postedDate to hours and minutes
    const dateObject = postedDate;
    // console.log("dateObject", dateObject.toLocaleTimeString());
    // console.log("dateObject: ", dateObject)

    const hours = Math.floor(dateObject / 3600);
    const minutes = Math.floor((dateObject % 3600) / 60);


    // Format and return the result
    return `${hours} hours ${minutes} minutes ago`;
};

const handleSortView = () => {
    const sortData = dataList?.sort(function (a, b) {
        const modA = parseFloat(a.others.views.replace('K', '')) || 0;
        const modB = parseFloat(b.others.views.replace('K', '')) || 0;
        return modA - modB;
    });

    loadView(sortData);
}

loadAllCategories();

handleShowCategories('1000')