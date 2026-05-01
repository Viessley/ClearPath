package com.clearpath.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Id;

@Entity
@Table(name = "scope_out_reports")
public class ScopeOutReport {

    @Id
    @Column(name = "trigger_key")
    private String triggerKey;

    @Column(name = "scope_out_kind")
    private String scopeOutKind;

    @Column(name = "situation")
    private String situation;

    @Column(name = "why_blocked")
    private String whyBlocked;

    @Column(name = "consequences")
    private String consequences;

    @Column(name = "next_step")
    private String nextStep;

    @Column(name = "after_resolved")
    private String afterResolved;

    @Column(name = "resource_links", columnDefinition = "jsonb")
    private String resourceLinks;

    public String getTriggerKey() { return triggerKey; }
    public void setTriggerKey(String triggerKey) { this.triggerKey = triggerKey; }

    public String getScopeOutKind() { return scopeOutKind; }
    public void setScopeOutKind(String scopeOutKind) { this.scopeOutKind = scopeOutKind; }

    public String getSituation() { return situation; }
    public void setSituation(String situation) { this.situation = situation; }

    public String getWhyBlocked() { return whyBlocked; }
    public void setWhyBlocked(String whyBlocked) { this.whyBlocked = whyBlocked; }

    public String getConsequences() { return consequences; }
    public void setConsequences(String consequences) { this.consequences = consequences; }

    public String getNextStep() { return nextStep; }
    public void setNextStep(String nextStep) { this.nextStep = nextStep; }

    public String getAfterResolved() { return afterResolved; }
    public void setAfterResolved(String afterResolved) { this.afterResolved = afterResolved; }

    public String getResourceLinks() { return resourceLinks; }
    public void setResourceLinks(String resourceLinks) { this.resourceLinks = resourceLinks; }
}
