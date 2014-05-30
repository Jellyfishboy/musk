'use strict';

(function() 
{

    var menuSelector, calculateOffset, displaySearchbar, displayMobileMenu;

    $(document).ready(function()
    {
        menuSelector();
        displaySearchbar();
        displayMobileMenu();
    });

    $(window).resize(function()
    {
        if ($(window).width() >= 767)
        {
            $('body').removeClass('menu-active');
            menuSelector();
        }
    });

    menuSelector = function() 
    {
        var $elem, parentOffset, firstWidth, firstOffset, firstValue;

        $elem = $('nav ul li.active');
        parentOffset = $('nav').offset();
        firstValue = calculateOffset($elem, parentOffset.left);
        $('#spot').css('left', firstValue);

        $('nav ul li').hoverIntent(function() 
        {
            var elemWidth, elemOffset, moveValue, timeout;

            timeout = $('nav ul li').data('timeout');
            if (timeout) clearTimeout(timeout);
            $('#spot').stop().animate({ left: calculateOffset($(this), parentOffset.left)+'px' });
        }, function()
        {
            $('nav ul li').data("timeout", setTimeout($.proxy(function() 
            {
                $('#spot').stop().animate({ left: firstValue+'px' });            
            }, this), 300));
            
        });
    };

    calculateOffset = function(elem, parentOffsetLeft)
    {
        var elemWidth, elemOffset;

        elemWidth = (elem.width()/2)-6;
        elemOffset = elem.offset();
        return (elemOffset.left - parentOffsetLeft)+elemWidth+15;
    };

    displaySearchbar = function()
    {
        $('li[title="search"]').click(function() 
        {
            $('body').toggleClass('search-active');
            $('li[title="menu"]').removeClass('active');
            $('.menu-active header').css('height', 80);
            $('body').removeClass('menu-active');
            $(this).toggleClass('active');
        });
    };

    displayMobileMenu = function ()
    {
        $('body').on('click', 'li[title="menu"]:not(.active)', function()
        {
            var mobileMenuHeight;

            mobileMenuHeight = $('header ul.mobile').outerHeight();
            $('body').addClass('menu-active');
            $('.menu-active header').css('height', 76+mobileMenuHeight);
            $('li[title="search"]').removeClass('active');
            $('body').removeClass('search-active');
            $(this).addClass('active');
        });

        $('body').on('click', 'li[title="menu"].active', function()
        {
            $('.menu-active header').css('height', 80);
            $('body').removeClass('menu-active');
            $(this).removeClass('active');
        });
    };

}).call(this);