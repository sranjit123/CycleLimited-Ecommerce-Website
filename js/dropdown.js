function toggleDropdown(btn) {
    const currentList = btn.nextElementSibling;

    document.querySelectorAll('.dropdown-list').forEach(list => {
        if (list !== currentList) {
            list.classList.remove('active');
        }
    });

    currentList.classList.toggle('active');
}

window.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-container')) {
        document.querySelectorAll('.dropdown-list').forEach(list => {
            list.classList.remove('active');
        });
    }
});



