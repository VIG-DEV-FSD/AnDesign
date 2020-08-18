$(function () {
    console.log(document.location.pathname)
    if (document.location.pathname == '/AnDesign' || document.location.pathname == '/AnDesign/index.html') {
        document.addEventListener('click', navigation);
        
        document.addEventListener('click', moreProjects)

        document.addEventListener('click', scrollToDiscus)

        if (document.location.hash) {
            let hash = document.location.hash
            document.location.hash = ''
            setTimeout(() => {
                scrollToHash(hash)
            }, 500)
        }

        window.addEventListener('resize', checkSize)
        checkSize()
    }

    let projects = 1

    document.addEventListener('click', openMenu)

    let checkboxes = {
        1: [],
        2: [],
        3: []
    }
    let page = 1

    if (document.location.pathname == '/AnDesign/calculate.html') {
        document.addEventListener('click', selectCheckbox)
        document.addEventListener('click', navigateQuestions)
    }

    document.addEventListener('change', function () {
        checkInput(event.target);
    });
    document.addEventListener('submit', checkForm);

    document.addEventListener('click', function () {

        if (!event.target.closest('.btn-modal')) return;

        event.preventDefault();

        let modal = document.querySelector('.modal');
        let content = document.querySelector('.form-module').innerHTML;

        openModal(modal, content, false);
    });

    let errs = {};
    document.querySelectorAll('form').forEach((form) => {
        errs[form] = [];
    });

    let masks = ['+0 (000) 000 00 00', '+000-00000000', '+000-000000000', '+00000000000']
    let mask = '+00000000000'
    let options = {
        onChange: function (cep, e) {

            let i

            if (cep[1] == '7') {
                i = 0
            } else if (cep[1] == '3') {
                if (cep[2] == '7') {
                    if (cep[3] == '3') {
                        i = 1
                    } else if (cep[3] == '5') {
                        i = 2
                    }
                } else if (cep[2] == '8' && cep[3] == '0') {
                    i = 2
                }
            }

            if (i === undefined) i = 3

            if (mask != masks[i]) {
                mask = masks[i]
                $('input[type="tel"]').each(function () {
                    $(this).mask(mask, options);
                });
            }

            let length = mask.length
            checkPhone(cep, e, length);
        }
    }

    $('input[type="tel"]').each(function () {
        $(this).mask(mask, options);
    });

    //FUNCTIONS

    function checkSize() {
        if (document.documentElement.clientWidth <= 500 && !document.querySelector('.process__inner').classList.contains('slick-slider')) {
            $('.process__inner').slick({
                arrows: false,
                dots: false,
                infinite: false
            })
            $('.process__inner').on('afterChange', function (event, slick, currentSlide) {
                processBar(currentSlide)
            })
        } else if (document.documentElement.clientWidth > 500 && document.querySelector('.process__inner').classList.contains('slick-slider')) {
            $('.process__inner').slick('unslick')
        }
    }

    function processBar(current) {

        let process = document.querySelector('.process')

        let bar = process.querySelector('.process__progress-value')

        let width = (current + 1) * 12.6
        if (width > 100) width = 100

        width += '%'

        bar.style.width = width
    }

    function openMenu() {

        if (!event.target.closest('.header__mobile-btn')) return

        $('.header__nav').slideDown(500)

        document.addEventListener('click', closeMenu)
        document.addEventListener('keyup', closeMenu)
    }

    function closeMenu() {

        let target = event.target

        if (!(target.closest('.close') || event.key == 'Escape' || !target.closest('header__nav'))) return;

        document.removeEventListener('click', closeMenu)
        document.removeEventListener('keyup', closeMenu)

        $('.header__nav').slideUp(500)
    }

    function selectCheckbox() {

        if (!event.target.closest('.page__questions-item')) return;

        let target = event.target.closest('.page__questions-item')
        let checkbox = target.querySelector('.page__questions-checkbox')

        if (checkbox.classList.contains('checked')) {
            checkbox.classList.remove('checked')
            let index = checkboxes[page].indexOf(target)
            if (index != -1) {
                checkboxes[page].splice(index, 1)
            }
        } else {
            checkbox.classList.add('checked')
            checkboxes[page].push(target)
        }


    }

    function navigateQuestions() {

        let target = event.target

        if (!(target.closest('.btn-next') || target.closest('.next') || target.closest('.prev') || target.closest('.btn-final'))) return

        let current = document.querySelector('.questions-' + page)
        let content


        if (target.closest('.btn-next') || target.closest('.next')) {
            if (!(checkboxes[page].length > 0)) return
            page++
        } else if (target.closest('.btn-final')) {
            page = 'final'
        }
        else {
            page--
        }

        content = document.querySelector('.questions-' + page)

        current.classList.remove('on')
        current.classList.add('off')

        setTimeout(() => {
            current.style.display = 'none'
            content.style.display = 'block'
            setTimeout(() => {
                content.classList.remove('off')
                content.classList.add('on')
            }, 50)

            if (page == 'final') {
                document.querySelector('.page__questions-score').style.display = 'none'
            } else {
                document.querySelector('.page__questions-score > span').innerHTML = '0' + page
            }


            if (page == 2) {
                document.querySelector('.page__questions-arrow.next').style.display = 'block'
                document.querySelector('.page__questions-arrow.prev').style.display = 'block'
                document.querySelector('.page__text').style.display = 'none'
                let margin
                if (document.documentElement.clientWidth <= 768 && document.documentElement.clientWidth > 500) margin = '56px'
                else if (document.documentElement.clientWidth <= 500) margin = '32px'
                else margin = '68px'
                document.querySelector('.page__title').style.marginBottom = margin
            } else if (page == 1) {
                document.querySelector('.page__questions-arrow.prev').style.display = 'none'
                document.querySelector('.page__text').style.display = 'block'
                document.querySelector('.page__title').style.marginBottom = '27px'
            } else if (page == 3) {
                document.querySelector('.page__questions-arrow.next').style.display = 'none'
            } else if (page == 'final') {
                document.querySelector('.page__questions-arrow.next').style.display = 'none'
                document.querySelector('.page__questions-arrow.prev').style.display = 'none'
            }
        }, 300)


    }

    function scrollToHash(hash) {
        hash = hash.slice(1)
        let obj = document.querySelector('.' + hash)
        let distance = $(obj).offset().top

        $('html, body').animate({
            scrollTop: distance
        }, 800);
    }

    function scrollToDiscus() {

        if (!event.target.closest('.process__btn')) return

        let obj = document.querySelector('.discus')
        let distance = $(obj).offset().top

        $('html, body').animate({
            scrollTop: distance
        }, 400);

    }

    function moreProjects() {

        if (!event.target.closest('.portfolio__btn')) return

        if (projects == 4) projects = 1
        else projects++

        let more = document.querySelector('.portfolio-' + projects)
        let moreProjects = more.querySelectorAll('.portfolio__item') 

        if (!moreProjects.length > 0){
            projects = 1
            more = document.querySelector('.portfolio-' + projects)
        }

        let target = event.target
        let box = document.querySelector('.portfolio__inner')
        box.classList.add('off')
        target.disabled = true
        setTimeout(() => {
            box.innerHTML = more.innerHTML
            box.classList.remove('off')
            target.disabled = false
        }, 300)

    }

    function navigation() {
        let target = event.target;

        if (target.tagName != 'A') return;
        if (!target.closest('.nav-menu')) return;

        event.preventDefault();

        // if (document.querySelector('.header__mobile').style.display == 'block') {
        //     closeMenu(document.querySelector('.header__mobile').querySelector('.close'));
        // }

        let obj;
        let top;

        if (target.dataset.target == 'top') {
            top = 0;
        } else {
            obj = document.querySelector('.' + target.dataset.target);
            top = $(obj).offset().top;
        }

        $('html, body').animate({
            scrollTop: top
        }, 800);
    }

    function openModal(modal, content, isTanks) {

        if (content) modal.querySelector('.modal__body').innerHTML = content;

        if (isTanks === true) modal.querySelector('.modal__inner').classList.add('thanks')

        $(modal).find('input[type="tel"]').each(function () {
            $(this).mask(mask, options);
        });

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.remove('off');
            modal.classList.add('on');
        }, 50)

        modal.addEventListener('click', function () {
            closeModal(event, modal);
        });
        document.addEventListener('keyup', function () {
            closeModal(event, modal);
        });

    }

    function closeModal(event, modal) {

        let target = event.target;

        if (!(target.closest('.close') || target.classList.contains('modal') || event.key == 'Escape')) return;

        modal.classList.remove('on');
        modal.classList.add('off');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.querySelector('.modal__inner').classList.remove('thanks')
        }, 1000);
        modal.removeEventListener('click', closeModal);
        document.removeEventListener('keyup', closeModal);
    }

    function checkInput(target) {
        let type = target.type;
        let form = target.closest('form');
        let regexp;
        let index = errs[form].indexOf(target);

        switch (type) {
            case 'text':
                regexp = /^[a-zA-Zа-яА-Я][a-zA-Zа-яА-Я\s]+$/;
                if (!target.value) {
                    form.nameValid = false;
                    target.classList.remove('error');
                    target.classList.remove('success');
                    if (index != -1) {
                        errs[form].splice(index, 1);
                    }
                }
                else if (regexp.test(target.value)) {
                    form.nameValid = true;
                    target.classList.remove('error');
                    target.classList.add('success');
                    if (index != -1) {
                        errs[form].splice(index, 1);
                    }
                }
                else {
                    form.nameValid = false;
                    target.classList.remove('success');
                    target.classList.add('error');
                    if (!errs[form].includes(target)) {
                        errs[form].push(target);
                    }
                }
                break;
            case 'email':
                regexp = /^[\w-.]+@([-\w]+\.)+[-\w]+$/;

                if (!target.value) {
                    form.emailValid = false;
                    target.classList.remove('error');
                    target.classList.remove('success');
                    if (index != -1) {
                        errs[form].splice(index, 1);
                    }
                }
                else if (regexp.test(target.value)) {
                    form.emailValid = true;
                    target.classList.remove('error');
                    target.classList.add('success');
                    if (index != -1) {
                        errs[form].splice(index, 1);
                    }
                }
                else {
                    form.emailValid = false;
                    target.classList.remove('success');
                    target.classList.add('error');
                    if (!errs[form].includes(target)) {
                        errs[form].push(target);
                    }
                }
                break;
        }
    }

    function checkPhone(value, event, length) {
        let target = event.target;
        let form = target.closest('form');
        let index = errs[form].indexOf(target);

        if (target.value.length == 0) {
            form.phoneValid = false;
            target.classList.remove('error');
            target.classList.remove('success');
            if (index != -1) {
                errs[form].splice(index, 1);
            }
        }
        else if (target.value.length == length && mask != masks[3]) {
            form.phoneValid = true;
            target.classList.remove('error');
            target.classList.add('success');
            if (index != -1) {
                errs[form].splice(index, 1);
            }
        }
        else {
            form.phoneValid = false;
            target.classList.remove('success');
            target.classList.add('error');
            if (!errs[form].includes(target)) {
                errs[form].push(target);
            }
        }
    }

    function checkForm() {
        event.preventDefault();

        let form = event.target;

        let data = new FormData();
        if (form.name) {
            if (!(errs[form].includes(form.name))) {
                data.append('name', form.name.value);
            }
        }
        if (form.phone) {
            if (!(form.phoneValid) && !(errs[form].includes(form.phone))) {
                errs[form].push(form.phone);
            } else {
                data.append('phone', form.phone.value);
            }
        }
        if (form.email) {
            if (!(errs[form].includes(form.email))) {
                data.append('email', form.email.value);
            }
        }
        if (form.textarea) {
            if (form.textarea.value) {
                data.append('comment', form.textarea.value);
            }
        }
        if (errs[form].length != 0) {
            for (err of errs[form]) {
                err.classList.remove('success');
                err.classList.add('error');
            }
            return;
        }

        // data.append('action', 'send_form');
        // data.append('nonce', ajax_query.nonce);

        // $.ajax({
        //     url: ajax_query.url,
        //     data: data,
        //     method: 'POST',
        //     contentType: false,
        //     processData: false,
        //     dataType: 'text',
        //     success: function (resp) {
        //         if (form.closest('.modal')) {
        //             let modalBody = form.closest('.modal').querySelector('.modal__body');
        //             modalBody.classList.add('off');

        //             setTimeout(() => {
        //                 modalBody.innerHTML = document.querySelector('.thanks-module').innerHTML;
        //                 modalBody.classList.add('modal__body-thanks');
        //                 setTimeout(() => {
        //                     modalBody.classList.remove('off');
        //                 }, 500);
        //             }, 500);

        //         } else {
        //             let modal = document.querySelector('#modal-count');
        //             let content = document.querySelector('.thanks-module').innerHTML;
        //             openModal(modal, content, true);
        //             clearForm(form);
        //         }
        //     }
        // });

        if (form.closest('.modal')) {
            let modalBody = form.closest('.modal').querySelector('.modal__body');
            modalBody.classList.add('off');

            setTimeout(() => {
                modalBody.innerHTML = document.querySelector('.thanks-module').innerHTML;
                modalBody.closest('.modal__inner').classList.add('thanks');
                setTimeout(() => {
                    modalBody.classList.remove('off');
                }, 200);
            }, 500);

        } else {
            let modal = document.querySelector('.modal');
            let content = document.querySelector('.thanks-module').innerHTML;
            openModal(modal, content, true);
            clearForm(form);
        }

    }

    function clearForm(form) {
        if (form.name) {
            form.name.value = '';
            form.name.classList.remove('success');
            form.nameValid = false;
        }
        if (form.email) {
            form.email.value = '';
            form.email.classList.remove('success');
            form.emailValid = false;
        }
        if (form.phone) {
            form.phone.value = '';
            form.phone.classList.remove('success');
            form.phoneValid = false;
        }
        if (form.textarea) {
            form.textarea.value = '';
        }
    }


});
