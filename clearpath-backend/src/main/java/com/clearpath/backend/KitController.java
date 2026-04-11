package com.clearpath.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/kits")

public class KitController {
    @Autowired
    private KitRepository kitRepository;

    @PostMapping("/save")
    public Map<String, Object> saveKit(@RequestBody Map<String, Object> request){
        Long userId = Long.valueOf(request.get("userId").toString());
        String title = (String) request.get(("title"));
        String serviceType = (String) request.get("serviceType");
        String content = (String) request.get("content");

        Kit kit = new Kit();
        kit.setUserId(userId);
        kit.setTitle((title));
        kit.setServiceType(serviceType);
        kit.setStatus("active");
        kit.setContent(content);
        kit.setCreatedAt(java.time.LocalDateTime.now());
        kit.setUpdatedAt(java.time.LocalDateTime.now());

        kitRepository.save(kit);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Kit save successfully");
        response.put("kitID", kit.getId());
        return response;
    }

    @GetMapping("/list/{userId}")
    public List<Kit> getKits(@PathVariable Long userId){
        return kitRepository.findByUserId(userId);
    }

    @GetMapping("/{kitId}")
    public Kit getKit(@PathVariable("kitId") Long kitId) {
        return kitRepository.findById(kitId).orElse(null);
    }

    @DeleteMapping("/{kitId}")
    public Map<String, Object> deleteKit(@PathVariable("kitId") Long kitId) {
        kitRepository.deleteById(kitId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Kit deleted successfully");
        return response;
    }
}
