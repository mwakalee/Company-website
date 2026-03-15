package com.company.website.api;

import java.util.List;

public record CompanyProfileResponse(
        String companyName,
        String headline,
        String subHeadline,
        List<Highlight> highlights,
        List<String> stats,
        List<String> techStack) {
}