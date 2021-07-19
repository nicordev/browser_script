// ==UserScript==
// @name         GitLab MR branch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the MR related branches in the console
// @author       You
// @match        https://bitbox.plateforme-2cloud.com/*
// @icon         https://www.google.com/s2/favicons?domain=plateforme-2cloud.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getSourceBranch() {
        return document.querySelector('.js-source-branch').title;
    }

    function getTargetBranch() {
        return document.querySelector('.js-target-branch').textContent.trim();
    }

    function logBranches() {
        let setIntervalKey = '';
        let sourceBranch = '';
        let targetBranch = '';

        setIntervalKey = setInterval(function () {
            try {
                sourceBranch = getSourceBranch();
                targetBranch = getTargetBranch();
            } catch (error) {
                console.warn('GitLab MR branch script: Could not find branches.')
            }

            if (!sourceBranch && !targetBranch) {
                return;
            }

            console.log(`Source branch:\n${sourceBranch}\n\nTargetBranch:\n${targetBranch}`);
            clearInterval(setIntervalKey);
        }, 1000);

        setTimeout(() => {
            clearInterval(setIntervalKey)
        }, 5000);
    }

    logBranches();
})();