package com.clearpath.backend;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GuideLibrary {

    public Map<String, Object> getGuide(String guideId) {
        return switch (guideId) {
            case "GUIDE_DRIVETEST_BOOKING"     -> driveTestBookingGuide();
            case "GUIDE_DRIVETEST_WALKTHROUGH" -> driveTestWalkthroughGuide();
            default -> Map.of("error", "Guide not found");
        };
    }

    private Map<String, Object> driveTestBookingGuide() {
        Map<String, Object> guide = new HashMap<>();
        guide.put("title", "How to Book Your G1 Test");
        guide.put("steps", List.of(
                "Go to drivetest.ca",
                "Click 'Book a Road Test'",
                "Select 'G1 Knowledge Test'",
                "Choose your location and time",
                "Pay $159.75 online"
        ));
        guide.put("tips", List.of(
                "Book at least 1 week in advance",
                "Weekday mornings are less busy",
                "Walk-in is available at some centres"
        ));
        guide.put("link", "https://drivetest.ca");
        return guide;
    }

    private Map<String, Object> driveTestWalkthroughGuide() {
        Map<String, Object> guide = new HashMap<>();
        guide.put("title", "What to Expect at DriveTest");
        guide.put("steps", List.of(
                "Arrive 15 minutes early",
                "Bring your original documents",
                "Tell the front desk: 'I'm here for my G1 knowledge test'",
                "Pay if you haven't paid online",
                "Wait to be called for the test"
        ));
        guide.put("tips", List.of(
                "The test is on a computer, multiple choice",
                "You can take it in multiple languages",
                "If you fail, you can rebook after 1 day"
        ));
        guide.put("afterPass",
                "Staff will take your photo and print your G1 licence on the spot!");
        guide.put("afterFail",
                "Pay $16 to rebook. Ask staff for a practice test booklet.");
        return guide;
    }
}